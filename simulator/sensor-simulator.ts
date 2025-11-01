import * as http from 'http'

// Equipment IDs to simulate
const equipmentIds = ['CNC-001', 'CNC-002', 'PRESS-001', 'CONV-001', 'WELD-001', 'LATHE-001']

// Sensor data ranges (realistic values)
const sensorRanges = {
  temperature: { min: 60, max: 100 },
  vibration: { min: 1, max: 8 },
  pressure: { min: 0, max: 200 },
  energy_consumption: { min: 20, max: 80 },
  rpm: { min: 0, max: 5000 },
  load_percentage: { min: 0, max: 100 }
}

// Function to generate random sensor reading
function generateSensorReading(equipmentId: string) {
  const now = new Date().toISOString()
  return {
    equipment_id: equipmentId,
    timestamp: now,
    temperature: Math.round((Math.random() * (sensorRanges.temperature.max - sensorRanges.temperature.min) + sensorRanges.temperature.min) * 10) / 10,
    vibration: Math.round((Math.random() * (sensorRanges.vibration.max - sensorRanges.vibration.min) + sensorRanges.vibration.min) * 10) / 10,
    pressure: Math.round((Math.random() * (sensorRanges.pressure.max - sensorRanges.pressure.min) + sensorRanges.pressure.min) * 10) / 10,
    energy_consumption: Math.round((Math.random() * (sensorRanges.energy_consumption.max - sensorRanges.energy_consumption.min) + sensorRanges.energy_consumption.min) * 10) / 10,
    rpm: Math.round(Math.random() * (sensorRanges.rpm.max - sensorRanges.rpm.min) + sensorRanges.rpm.min),
    load_percentage: Math.round(Math.random() * (sensorRanges.load_percentage.max - sensorRanges.load_percentage.min) + sensorRanges.load_percentage.min)
  }
}

// Create servers for each equipment
const servers: http.Server[] = []

equipmentIds.forEach((equipmentId, index) => {
  const port = 3000 + index

  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
      const sensorData = generateSensorReading(equipmentId)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(sensorData, null, 2))
    } else {
      res.writeHead(404)
      res.end('Not Found')
    }
  })

  servers.push(server)

  server.listen(port, () => {
    console.log(`[Sensor Simulator] ${equipmentId} sensor data available at http://localhost:${port}`)
  })
})

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Sensor Simulator] Shutting down servers...')
  servers.forEach((server, index) => {
    server.close(() => {
      console.log(`[Sensor Simulator] Server on port ${3000 + index} closed`)
    })
  })
  process.exit(0)
})

console.log(`[Sensor Simulator] Started ${equipmentIds.length} sensor simulators on ports 3000-${3000 + equipmentIds.length - 1}`)
console.log('[Sensor Simulator] Press Ctrl+C to stop')