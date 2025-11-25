// supOS Database Synchronization Service
// Writes FactoryGuard data to REAL supOS PostgreSQL and TimescaleDB

import { Client } from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

console.log('[FactoryGuard] Starting supOS Database Sync Service...')
console.log('[FactoryGuard] PostgreSQL:', process.env.SUPOS_POSTGRES_URL?.split('@')[1])
console.log('[FactoryGuard] TimescaleDB:', process.env.SUPOS_TSDB_URL?.split('@')[1])

// Database clients
let pgClient: Client | null = null
let tsdbClient: Client | null = null
let dbConnected = false

// Load local data
const dataFile = path.resolve(process.cwd(), 'local-data.json')
let localData: any = { equipment: {}, sensorReadings: [], alerts: [] }

try {
    if (fs.existsSync(dataFile)) {
        localData = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
        console.log('[FactoryGuard] Loaded local data for database sync')
    }
} catch (error) {
    console.log('[FactoryGuard] No local data file')
}

// Connect to supOS databases
async function connectToDatabases() {
    try {
        // Connect to PostgreSQL
        pgClient = new Client({
            connectionString: process.env.SUPOS_POSTGRES_URL,
            ssl: false // supOS typically doesn't use SSL for local connections
        })

        await pgClient.connect()
        console.log('[FactoryGuard] ✅ Connected to supOS PostgreSQL')

        // Connect to TimescaleDB
        tsdbClient = new Client({
            connectionString: process.env.SUPOS_TSDB_URL,
            ssl: false
        })

        await tsdbClient.connect()
        console.log('[FactoryGuard] ✅ Connected to supOS TimescaleDB')

        dbConnected = true

        // Create tables if they don't exist
        await createTables()

    } catch (error: any) {
        console.error('[FactoryGuard] Database connection error:', error.message)
        dbConnected = false
    }
}

// Create tables in supOS databases
async function createTables() {
    if (!pgClient || !tsdbClient) return

    try {
        // Create equipment table in PostgreSQL
        await pgClient.query(`
      CREATE TABLE IF NOT EXISTS equipment (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        status TEXT,
        health_score INTEGER,
        location TEXT,
        temperature DECIMAL(5,2),
        vibration DECIMAL(5,2),
        pressure DECIMAL(5,2),
        energy DECIMAL(8,2),
        rpm INTEGER,
        load_percentage DECIMAL(5,2),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
        console.log('[FactoryGuard] ✅ Equipment table ready in PostgreSQL')

        // Create sensor_readings table in TimescaleDB
        await tsdbClient.query(`
      CREATE TABLE IF NOT EXISTS sensor_readings (
        id SERIAL,
        equipment_id TEXT NOT NULL,
        sensor_type TEXT NOT NULL,
        value DECIMAL(10,2),
        unit TEXT,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY (id, timestamp)
      )
    `)
        console.log('[FactoryGuard] ✅ Sensor readings table ready in TimescaleDB')

        // Try to create hypertable (TimescaleDB feature)
        try {
            await tsdbClient.query(`
        SELECT create_hypertable('sensor_readings', 'timestamp', if_not_exists => TRUE)
      `)
            console.log('[FactoryGuard] ✅ TimescaleDB hypertable created')
        } catch (e) {
            // Hypertable might already exist or TimescaleDB extension not installed
            console.log('[FactoryGuard] ℹ️  Hypertable creation skipped (may already exist)')
        }

    } catch (error: any) {
        console.error('[FactoryGuard] Table creation error:', error.message)
    }
}

// Sync equipment data to PostgreSQL
async function syncEquipmentToPostgres() {
    if (!dbConnected || !pgClient) return

    const equipment = Object.values(localData.equipment || {})
    if (equipment.length === 0) return

    for (const eq of equipment as any[]) {
        try {
            await pgClient.query(`
        INSERT INTO equipment (id, name, type, status, health_score, location, temperature, vibration, pressure, energy, rpm, load_percentage, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          type = EXCLUDED.type,
          status = EXCLUDED.status,
          health_score = EXCLUDED.health_score,
          location = EXCLUDED.location,
          temperature = EXCLUDED.temperature,
          vibration = EXCLUDED.vibration,
          pressure = EXCLUDED.pressure,
          energy = EXCLUDED.energy,
          rpm = EXCLUDED.rpm,
          load_percentage = EXCLUDED.load_percentage,
          updated_at = NOW()
      `, [
                eq.id,
                eq.name,
                eq.type,
                eq.status,
                eq.health || eq.health_score || 100,
                eq.location,
                eq.temperature,
                eq.vibration,
                eq.pressure,
                eq.energy,
                eq.rpm,
                eq.load
            ])

            console.log(`[FactoryGuard] 💾 Synced equipment to PostgreSQL: ${eq.name}`)
        } catch (error: any) {
            console.error(`[FactoryGuard] Error syncing equipment ${eq.id}:`, error.message)
        }
    }
}

// Sync sensor readings to TimescaleDB
async function syncSensorsToTimescaleDB() {
    if (!dbConnected || !tsdbClient) return

    const recentReadings = (localData.sensorReadings || []).slice(-20)
    if (recentReadings.length === 0) return

    for (const reading of recentReadings) {
        try {
            await tsdbClient.query(`
        INSERT INTO sensor_readings (equipment_id, sensor_type, value, unit, timestamp)
        VALUES ($1, $2, $3, $4, $5)
      `, [
                reading.equipment_id,
                reading.sensor_type,
                reading.value,
                reading.unit,
                reading.timestamp || new Date().toISOString()
            ])

            console.log(`[FactoryGuard] 💾 Synced sensor to TimescaleDB: ${reading.sensor_type} = ${reading.value}`)
        } catch (error: any) {
            console.error(`[FactoryGuard] Error syncing sensor:`, error.message)
        }
    }
}

// Initialize database connections
connectToDatabases()

// Sync data every 15 seconds
setInterval(async () => {
    if (!dbConnected) {
        console.log('[FactoryGuard] Attempting to reconnect to databases...')
        await connectToDatabases()
        return
    }

    // Reload local data
    try {
        if (fs.existsSync(dataFile)) {
            localData = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
        }
    } catch (error) {
        // Ignore
    }

    // Sync to databases
    console.log('[FactoryGuard] 🔄 Syncing data to supOS databases...')
    await syncEquipmentToPostgres()
    await syncSensorsToTimescaleDB()
}, 15000)

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('[FactoryGuard] Shutting down database sync service...')
    if (pgClient) await pgClient.end()
    if (tsdbClient) await tsdbClient.end()
    process.exit(0)
})

console.log('[FactoryGuard] supOS Database Sync Service started - syncing every 15 seconds')
