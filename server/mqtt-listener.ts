import mqtt from 'mqtt'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { broadcast } from './broadcast'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

console.log('[FactoryGuard] MQTT Configuration:')
console.log(`  Broker: ${process.env.MQTT_BROKER_URL || 'NOT SET'}`)
console.log(`  Port: ${process.env.MQTT_BROKER_PORT || 'NOT SET'}`)
console.log(`  Username: ${process.env.MQTT_USERNAME || 'NOT SET'}`)

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

  // Subscribe to all sensor topics
  const topics = [
    'sensors/+/temperature',
    'sensors/+/vibration',
    'sensors/+/pressure',
    'sensors/+/energy',
    'sensors/+/all'
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
    const equipmentId = parts[1]
    const metric = parts[2]

    const payload = JSON.parse(message.toString())

    console.log(`[FactoryGuard] Received ${metric} data for ${equipmentId}:`, payload)

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from('sensor_readings')
      .insert({
        equipment_id: equipmentId,
        timestamp: new Date().toISOString(),
        temperature: payload.temperature,
        vibration: payload.vibration,
        pressure: payload.pressure,
        energy_consumption: payload.energy,
        rpm: payload.rpm,
        load_percentage: payload.load,
      })
      .select()
      .single()

    if (error) throw error

    // Broadcast to WebSocket clients
    broadcast('reading:new', data)

    // Check for anomalies and create alerts
    await checkAnomalies(equipmentId, payload)

  } catch (error) {
    console.error('[FactoryGuard] MQTT message processing error:', error)
  }
})

async function checkAnomalies(equipmentId: string, reading: any) {
  const alerts = []

  // Temperature threshold
  if (reading.temperature > 80) {
    alerts.push({
      equipment_id: equipmentId,
      severity: reading.temperature > 90 ? 'critical' : 'warning',
      type: 'temperature',
      message: `High temperature detected: ${reading.temperature}°C`,
      recommended_action: 'Check cooling system and reduce load',
    })
  }

  // Vibration threshold
  if (reading.vibration > 6.0) {
    alerts.push({
      equipment_id: equipmentId,
      severity: reading.vibration > 7.5 ? 'critical' : 'warning',
      type: 'vibration',
      message: `Excessive vibration detected: ${reading.vibration} mm/s`,
      recommended_action: 'Inspect bearings and alignment',
    })
  }

  // Insert alerts
  if (alerts.length > 0) {
    const { error } = await supabaseAdmin
      .from('alerts')
      .insert(alerts)

    if (error) console.error('[FactoryGuard] Alert creation error:', error)
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