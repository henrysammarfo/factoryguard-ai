import { NextResponse } from 'next/server'
import { initializeSupOSIntegration } from '@/server/supos-integration'

export async function POST() {
  try {
    console.log('[FactoryGuard] Attempting to connect to supOS...')

    const success = await initializeSupOSIntegration()

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Successfully connected to supOS',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to connect to supOS',
          message: 'Check supOS credentials and network connectivity'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[FactoryGuard] supOS connection API error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to supOS', success: false },
      { status: 500 }
    )
  }
}