// supOS Data Synchronization Service
// Publishes FactoryGuard data to supOS-compatible MQTT topics

import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

console.log('[FactoryGuard] Starting supOS synchronization service...')
console.log('[FactoryGuard] MQTT Broker:', process.env.MQTT_BROKER_URL)

// Load local data
const dataFile = path.resolve(process.cwd(), 'local-data.json')
let localData: any = { equipment: {}, sensorReadings: [], alerts: [] }

try {
  if (fs.existsSync(dataFile)) {
    localData = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
    console.log('[FactoryGuard] Loaded local data for supOS sync')
  }
} catch (error) {
  console.log('[FactoryGuard] No local data file for supOS sync')
}

// Connect to MQTT using HiveMQ cloud broker
let mqttClient: mqtt.MqttClient | null = null
let mqttConnected = false

async function initializeSupOSConnection() {
  try {
    console.log('[FactoryGuard] Connecting to MQTT broker for supOS sync...')

    mqttClient = mqtt.connect({
      host: process.env.MQTT_BROKER_URL!,
      port: parseInt(process.env.MQTT_BROKER_PORT || '8883'),
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      protocol: process.env.MQTT_USE_TLS === 'true' ? 'mqtts' : 'mqtt',
      clientId: `factoryguard-supos-sync-${Date.now()}`,
      clean: true,
      reconnectPeriod: 5000,
      rejectUnauthorized: true
    })

    mqttClient.on('connect', () => {
      console.log('[FactoryGuard] ✅ Connected to MQTT broker for supOS synchronization')
      mqttConnected = true
    })

    mqttClient.on('error', (error: any) => {
      console.error('[FactoryGuard] MQTT connection error:', error.message)
      mqttConnected = false
    })

    mqttClient.on('close', () => {
      console.log('[FactoryGuard] MQTT connection closed')
      mqttConnected = false
    })

  } catch (error) {
    console.error('[FactoryGuard] supOS connection error:', error)
  }
}

// Publish equipment data to supOS
function publishEquipmentToSupOS() {
  if (!mqttConnected || !mqttClient) {
    return
  }

  const equipment = Object.values(localData.equipment || {})

  equipment.forEach((eq: any) => {
    const topic = `factory/equipment/${eq.id}`
    const data = {
      id: eq.id,
      name: eq.name,
      type: eq.type,
      status: eq.status,
      health_score: eq.health || eq.health_score,
      location: eq.location,
      temperature: eq.temperature,
      vibration: eq.vibration,
      source: 'factoryguard',
      timestamp: new Date().toISOString()
    }

    mqttClient!.publish(topic, JSON.stringify(data), { qos: 1 }, (err) => {
      if (!err) {
        console.log(`[FactoryGuard] 📤 Equipment: ${eq.name}`)
      }
    })
  })
}

// Publish sensor readings to supOS
function publishSensorDataToSupOS() {
  if (!mqttConnected || !mqttClient) {
    return
  }

  const recentReadings = (localData.sensorReadings || []).slice(-10)

  recentReadings.forEach((reading: any) => {
    const equipment = localData.equipment[reading.equipment_id]
    const location = equipment?.location || 'workshopA/productionLine1'
    const [workshop, productionLine] = location.split('/')

    const topic = `factory/${workshop}/${productionLine}/${reading.equipment_id}/sensors/${reading.sensor_type}`
    const data = {
      equipment_id: reading.equipment_id,
      sensor_type: reading.sensor_type,
      value: reading.value,
      unit: reading.unit,
      timestamp: reading.timestamp,
      source: 'factoryguard'
    }

    mqttClient!.publish(topic, JSON.stringify(data), { qos: 1 }, (err) => {
      if (!err) {
        console.log(`[FactoryGuard] 📤 Sensor: ${reading.sensor_type} = ${reading.value}`)
      }
    })
  })
}

// Initialize connection
initializeSupOSConnection()

// Sync data every 10 seconds
setInterval(() => {
  if (!mqttConnected) {
    initializeSupOSConnection()
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

  // Publish data to supOS
  console.log('[FactoryGuard] 🔄 Syncing to supOS...')
  publishEquipmentToSupOS()
  publishSensorDataToSupOS()
}, 10000)

console.log('[FactoryGuard] supOS sync service started - publishing every 10 seconds')
