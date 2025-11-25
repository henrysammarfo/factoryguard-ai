import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Load local data
    const dataFile = path.resolve(process.cwd(), 'local-data.json')
    let localData: any = { equipment: {}, sensorReadings: [], alerts: [] }

    try {
      if (fs.existsSync(dataFile)) {
        localData = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
      }
    } catch (error) {
      console.log('[FactoryGuard] No local data file, returning empty data')
    }

    // Convert equipment object to array
    let equipment = Object.values(localData.equipment || {})

    // Apply filters
    if (status) {
      equipment = equipment.filter((eq: any) => eq.status === status)
    }
    if (type) {
      equipment = equipment.filter((eq: any) => eq.type?.toLowerCase().includes(type.toLowerCase()))
    }

    // Sort by name
    equipment.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))

    return NextResponse.json({ data: equipment, success: true })
  } catch (error) {
    console.error('[FactoryGuard] Equipment API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch equipment', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate unique ID for equipment
    const equipmentId = `${body.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`

    // Create equipment object
    const equipment = {
      id: equipmentId,
      name: body.name,
      type: body.type || 'Industrial Equipment',
      status: 'operational',
      health: 100,
      location: body.location || 'workshopA/productionLine1',
      alerts: 0,
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      installDate: new Date().toISOString().split('T')[0],
      manufacturer: 'supOS Connected',
      model: `${body.type?.toUpperCase() || 'EQUIPMENT'}_${equipmentId.split('_').pop()}`,
      serialNumber: `SUPOS-${body.type?.toUpperCase() || 'EQUIPMENT'}_${equipmentId.split('_').pop()}`,
      temperature: Math.floor(Math.random() * 20) + 65, // Random temp between 65-85°C
      vibration: Math.random() * 2 + 1, // Random vibration between 1-3 mm/s
      pressure: Math.floor(Math.random() * 4) + 9, // Random pressure between 9-13 bar
      energy: Math.floor(Math.random() * 20) + 50, // Random energy between 50-70 kW
      rpm: Math.floor(Math.random() * 300) + 1900, // Random RPM between 1900-2200
      load: Math.floor(Math.random() * 30) + 65 // Random load between 65-95%
    }

    // Load existing data
    const dataFile = path.resolve(process.cwd(), 'local-data.json')
    let localData: any = { equipment: {}, sensorReadings: [], alerts: [] }

    try {
      if (fs.existsSync(dataFile)) {
        localData = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
      }
    } catch (error) {
      console.log('[FactoryGuard] Creating new local data file')
    }

    // Add equipment to local data
    localData.equipment[equipmentId] = equipment

    // Generate initial sensor readings for the new equipment
    const sensorTypes = ['temperature', 'vibration', 'pressure', 'energy', 'rpm', 'load']
    const units = { temperature: '°C', vibration: 'mm/s', pressure: 'bar', energy: 'kW', rpm: 'rpm', load: '%' }
    const timestamp = new Date().toISOString()

    sensorTypes.forEach(sensorType => {
      const reading = {
        id: `${equipmentId}_${sensorType}_${Date.now()}`,
        equipment_id: equipmentId,
        sensor_type: sensorType,
        value: equipment[sensorType],
        unit: units[sensorType],
        timestamp,
        workshop: equipment.location.split('/')[0],
        production_line: equipment.location.split('/')[1],
        source: 'supos_mqtt_test'
      }
      localData.sensorReadings.push(reading)
    })

    // Save updated data
    fs.writeFileSync(dataFile, JSON.stringify(localData, null, 2))

    // Broadcast equipment addition via WebSocket
    try {
      const { broadcastEquipmentUpdate } = await import('../../../server/broadcast')
      await broadcastEquipmentUpdate('equipment_added', equipment)
    } catch (error) {
      console.log('[FactoryGuard] WebSocket broadcast not available')
    }

    return NextResponse.json({ data: equipment, success: true }, { status: 201 })
  } catch (error) {
    console.error('[FactoryGuard] Equipment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create equipment', success: false },
      { status: 500 }
    )
  }
}