import mqtt from 'mqtt'
import { broadcast } from './broadcast'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

console.log('[FactoryGuard] MQTT Configuration:')
console.log(`  Broker: ${process.env.MQTT_BROKER_URL || 'NOT SET'}`)
console.log(`  Port: ${process.env.MQTT_BROKER_PORT || 'NOT SET'}`)
console.log(`  Username: ${process.env.MQTT_USERNAME || 'NOT SET'}`)

// Local data storage
const dataFile = path.resolve(process.cwd(), 'local-data.json')
let localData: any = {
  equipment: {},
  sensorReadings: [],
  alerts: []
}

// Load existing data
try {
  if (fs.existsSync(dataFile)) {
    localData = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
  }
} catch (error) {
  console.log('[FactoryGuard] No existing local data file, starting fresh')
}

// Save data to file
function saveData() {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(localData, null, 2))
  } catch (error) {
    console.error('[FactoryGuard] Failed to save local data:', error)
  }
}

// Skip MQTT if not configured
if (!process.env.MQTT_BROKER_URL) {
  console.log('[FactoryGuard] ❌ MQTT broker not configured - skipping MQTT listener')
  console.log('[FactoryGuard] MQTT listener service loaded (inactive)')
  process.exit(0)
}

console.log(`[FactoryGuard] Connecting to MQTT broker: ${process.env.MQTT_BROKER_URL}:${process.env.MQTT_BROKER_PORT}`)

const client = mqtt.connect({
  host: process.env.MQTT_BROKER_URL!,
  port: parseInt(process.env.MQTT_BROKER_PORT || '8883'),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  protocol: process.env.MQTT_USE_TLS === 'true' ? 'mqtts' : 'mqtt',
  rejectUnauthorized: true,
  reconnectPeriod: 5000, // Retry every 5 seconds
})

client.on('connect', () => {
  console.log('[FactoryGuard] ✅ Successfully connected to MQTT broker!')

  // Subscribe to all sensor topics in UNS format
  const topics = [
    'factory/+/+/+/sensors/temperature',
    'factory/+/+/+/sensors/vibration',
    'factory/+/+/+/sensors/pressure',
    'factory/+/+/+/sensors/energy',
    'factory/+/+/+/sensors/rpm',
    'factory/+/+/+/sensors/load',
    'factory/+/+/+/status'
  ]

  topics.forEach(topic => {
    client.subscribe(topic, (err) => {
      if (err) {
        console.error(`[FactoryGuard] ❌ Failed to subscribe to ${topic}:`, err)
      } else {
        console.log(`[FactoryGuard] ✅ Subscribed to ${topic}`)
      }
    })
  })
})

client.on('message', async (topic, message) => {
  try {
    const parts = topic.split('/')
    const equipmentId = parts[3] // factory/workshopA/productionLine1/cnc_machine_001/sensors/temperature
    const sensorType = parts[5] // temperature, vibration, etc.

    const payload = JSON.parse(message.toString())

    console.log(`[FactoryGuard] 📥 Received supOS CE ${sensorType} data for ${equipmentId}:`, payload)

    // Store in local data
    const reading = {
      id: payload.id,
      equipment_id: payload.equipment_id,
      sensor_type: payload.sensor_type,
      value: payload.value,
      unit: payload.unit,
      timestamp: payload.timestamp,
      workshop: payload.workshop,
      production_line: payload.production_line,
      source: payload.source
    }

    // Update equipment data
    if (!localData.equipment[equipmentId]) {
      localData.equipment[equipmentId] = {
        id: equipmentId,
        name: `${equipmentId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        type: equipmentId.includes('cnc') ? 'CNC Milling' : 'Industrial Equipment',
        status: 'operational',
        health: 85,
        location: `${payload.workshop}/${payload.production_line}`,
        alerts: 0,
        lastMaintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        installDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        manufacturer: 'supOS Connected',
        model: equipmentId.toUpperCase(),
        serialNumber: `SUPOS-${equipmentId.toUpperCase()}`,
        temperature: 70,
        vibration: 2.0,
        pressure: 6.0,
        energy: 45.0,
        rpm: 2800,
        load: 70
      }
    }

    // Update equipment sensor values
    const equipment = localData.equipment[equipmentId]
    if (payload.sensor_type) {
      equipment[payload.sensor_type] = payload.value

      // Update health based on sensor values
      let healthScore = 100
      if (payload.temperature > 80) healthScore -= 20
      if (payload.vibration > 5) healthScore -= 15
      if (payload.pressure > 8) healthScore -= 10
      if (payload.energy > 60) healthScore -= 5
      equipment.health = Math.max(50, healthScore)

      // Update status
      if (healthScore < 70) {
        equipment.status = 'critical'
      } else if (healthScore < 85) {
        equipment.status = 'warning'
      } else {
        equipment.status = 'operational'
      }
    }

    // Add to sensor readings
    localData.sensorReadings.push(reading)

    // Keep only last 1000 readings
    if (localData.sensorReadings.length > 1000) {
      localData.sensorReadings = localData.sensorReadings.slice(-1000)
    }

    // Save to file
    saveData()

    // Broadcast to WebSocket clients
    broadcast('reading:new', reading)

    // Check for anomalies and create alerts
    checkAnomalies(equipmentId, payload)

  } catch (error) {
    console.error('[FactoryGuard] MQTT message processing error:', error)
  }
})

function checkAnomalies(equipmentId: string, reading: any) {
  const alerts = []

  // Temperature threshold
  if (reading.temperature > 80) {
    alerts.push({
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      equipment_id: equipmentId,
      equipment_name: localData.equipment[equipmentId]?.name || equipmentId,
      severity: reading.temperature > 90 ? 'critical' : 'warning',
      type: 'temperature',
      message: `High temperature detected: ${reading.temperature}°C`,
      recommended_action: 'Check cooling system and reduce load',
      timestamp: new Date(),
      acknowledged: false,
    })
  }

  // Vibration threshold
  if (reading.vibration > 6.0) {
    alerts.push({
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      equipment_id: equipmentId,
      equipment_name: localData.equipment[equipmentId]?.name || equipmentId,
      severity: reading.vibration > 7.5 ? 'critical' : 'warning',
      type: 'vibration',
      message: `Excessive vibration detected: ${reading.vibration} mm/s`,
      recommended_action: 'Inspect bearings and alignment',
      timestamp: new Date(),
      acknowledged: false,
    })
  }

  // Add alerts to local data
  if (alerts.length > 0) {
    localData.alerts.push(...alerts)

    // Update equipment alert count
    if (localData.equipment[equipmentId]) {
      localData.equipment[equipmentId].alerts = (localData.equipment[equipmentId].alerts || 0) + alerts.length
    }

    // Keep only last 100 alerts
    if (localData.alerts.length > 100) {
      localData.alerts = localData.alerts.slice(-100)
    }

    saveData()

    // Broadcast alerts to WebSocket clients
    alerts.forEach(alert => {
      broadcast('alert:new', alert)
    })
  }
}

client.on('error', (error: any) => {
  if (error.code === 'ECONNREFUSED') {
    console.log('[FactoryGuard] ⚠️  MQTT broker not available - retrying...')
    return
  }
  console.error('[FactoryGuard] ❌ MQTT error:', error.message || error)
})

client.on('reconnect', () => {
  console.log('[FactoryGuard] 🔄 Reconnecting to MQTT broker...')
})

client.on('offline', () => {
  console.log('[FactoryGuard] ⚠️  MQTT client offline')
})

client.on('close', () => {
  console.log('[FactoryGuard] 🔌 MQTT connection closed')
})

console.log('[FactoryGuard] MQTT listener service started - waiting for connection...')