import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    let query = supabaseAdmin
      .from('equipment')
      .select(`
        *,
        alerts:alerts(count),
        latest_reading:sensor_readings(*)
          .order('timestamp', { ascending: false })
          .limit(1)
      `)

    if (status) query = query.eq('status', status)
    if (type) query = query.eq('type', type)

    const { data, error } = await query.order('name')

    if (error) throw error

    return NextResponse.json({ data, success: true })
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