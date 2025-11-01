// Test MQTT Publisher - Sends test sensor data to MQTT Broker
// Load credentials from .env.local
require('dotenv').config({ path: '.env.local' })
const mqtt = require('mqtt')

const client = mqtt.connect({
  host: process.env.MQTT_BROKER_URL,
  port: parseInt(process.env.MQTT_BROKER_PORT || '8883'),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  protocol: process.env.MQTT_USE_TLS === 'true' ? 'mqtts' : 'mqtt',
  rejectUnauthorized: true,
})

client.on('connect', () => {
  console.log('✅ Connected to MQTT broker!')
  
  // Publish test sensor data every 5 seconds
  setInterval(() => {
    const equipmentId = 'CNC-001'
    const data = {
      temperature: 70 + Math.random() * 20, // 70-90°C
      vibration: 4 + Math.random() * 3,     // 4-7 mm/s
      pressure: 6 + Math.random() * 2,      // 6-8 bar
      energy: 45 + Math.random() * 10,      // 45-55 kW
      rpm: 2800 + Math.random() * 400,      // 2800-3200 RPM
      load: 70 + Math.random() * 20,        // 70-90%
    }

    const topic = `sensors/${equipmentId}/all`
    client.publish(topic, JSON.stringify(data), (err) => {
      if (err) {
        console.error('❌ Publish error:', err)
      } else {
        console.log(`📤 Published to ${topic}:`, data)
      }
    })
  }, 5000)
})

client.on('error', (error) => {
  console.error('❌ MQTT error:', error.message)
})

console.log('🚀 Starting MQTT test publisher...')
console.log('📡 Connecting to HiveMQ Cloud...')
