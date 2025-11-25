import { NextResponse } from 'next/server'
import { getSupOSStatus } from '@/server/supos-integration'

export async function GET() {
  try {
    const status = getSupOSStatus()

    return NextResponse.json({
      success: true,
      supos_connected: status.connected,
      eventflow_connected: status.eventFlowConnected,
      authenticated: status.hasToken,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[FactoryGuard] supOS status API error:', error)
    return NextResponse.json(
      { error: 'Failed to get supOS status', success: false },
      { status: 500 }
    )
  }
}