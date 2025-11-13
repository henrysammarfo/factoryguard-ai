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

    const { data, error } = await supabaseAdmin
      .from('equipment')
      .insert(body)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, success: true }, { status: 201 })
  } catch (error) {
    console.error('[FactoryGuard] Equipment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create equipment', success: false },
      { status: 500 }
    )
  }
}