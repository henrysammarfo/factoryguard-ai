import { authenticateWithSupOS, connectToSupOSEventFlow, connectToSupOSSourceFlow, createSupOSDashboard, checkSupOSConnection, fetchSupOSEquipment, fetchSupOSSensorData } from '@/lib/supos/client'

let suposConnected = false
let suposToken: string | null = null
let eventFlowConnection: WebSocket | null = null
let suposEquipmentData: any = null
let suposSensorData: any = null

export async function initializeSupOSIntegration() {
  console.log('[FactoryGuard] Initializing supOS integration...')

  try {
    // Step 1: Check if supOS is actually running
    const connectionCheck = await checkSupOSConnection()
    
    if (!connectionCheck.connected) {
      console.log('[FactoryGuard] supOS is not reachable:', connectionCheck.message || 'Not running')
      suposConnected = false
      return
    }
    
    console.log('[FactoryGuard] supOS is reachable at:', connectionCheck.endpoint)
    
    // Step 2: Authenticate with supOS
    const authResult = await authenticateWithSupOS()
    if (authResult) {
      suposToken = authResult.access_token
      suposConnected = true
      console.log('[FactoryGuard] Successfully authenticated with supOS')

      // Step 3: Fetch equipment data from supOS
      suposEquipmentData = await fetchSupOSEquipment(suposToken)
      if (suposEquipmentData) {
        console.log('[FactoryGuard] Fetched supOS equipment data')
      }

      // Step 4: Fetch sensor data from supOS
      suposSensorData = await fetchSupOSSensorData(suposToken)
      if (suposSensorData) {
        console.log('[FactoryGuard] Fetched supOS sensor data')
      }

      // Step 5: Connect to EventFlow (WebSocket) - optional
      try {
        eventFlowConnection = connectToSupOSEventFlow(suposToken)
        if (eventFlowConnection) {
          console.log('[FactoryGuard] Connected to supOS EventFlow')
        }
      } catch (err) {
        console.log('[FactoryGuard] EventFlow connection skipped (optional)')
      }

      // Step 6: Connect to SourceFlow (MQTT) - optional
      try {
        const sourceFlowConnected = await connectToSupOSSourceFlow(suposToken)
        if (sourceFlowConnected) {
          console.log('[FactoryGuard] Connected to supOS SourceFlow')
        }
      } catch (err) {
        console.log('[FactoryGuard] SourceFlow connection skipped (optional)')
      }

      // Step 7: Create supOS Dashboard - optional
      try {
        const dashboard = await createSupOSDashboard(suposToken)
        if (dashboard) {
          console.log('[FactoryGuard] Created supOS dashboard integration')
        }
      } catch (err) {
        console.log('[FactoryGuard] Dashboard creation skipped (optional)')
      }

    } else {
      console.log('[FactoryGuard] supOS authentication failed - will retry later')
      suposConnected = false
    }
  } catch (error) {
    console.error('[FactoryGuard] supOS integration initialization error:', error)
    suposConnected = false
  }
}

export function getSupOSStatus() {
  return {
    connected: suposConnected,
    hasToken: suposToken !== null,
    eventFlowConnected: eventFlowConnection?.readyState === 1, // 1 = OPEN
    hasEquipmentData: suposEquipmentData !== null,
    hasSensorData: suposSensorData !== null,
    equipmentCount: suposEquipmentData ? (Array.isArray(suposEquipmentData) ? suposEquipmentData.length : 0) : 0,
    lastAttempt: new Date().toISOString()
  }
}

export function getSupOSEquipmentData() {
  return suposEquipmentData
}

export function getSupOSSensorData() {
  return suposSensorData
}

export async function syncEquipmentWithSupOS(equipment: any) {
  if (!suposConnected || !suposToken) {
    console.log('[FactoryGuard] supOS not connected - skipping equipment sync')
    return
  }

  try {
    // Sync equipment data with supOS DBConnect
    console.log('[FactoryGuard] Syncing equipment with supOS:', equipment.name)

    const { suposDbClient } = await import('@/lib/supos/client')

    // Insert equipment into supOS database
    const { data, error } = await suposDbClient
      .from('equipment')
      .upsert({
        id: equipment.id,
        name: equipment.name,
        type: equipment.type,
        location: equipment.location,
        manufacturer: equipment.manufacturer,
        model: equipment.model,
        serial_number: equipment.serial_number,
        installation_date: equipment.installation_date,
        status: equipment.status,
        health_score: equipment.health_score,
        last_maintenance: equipment.last_maintenance,
        next_maintenance: equipment.next_maintenance,
        metadata: equipment.metadata,
        synced_from_factoryguard: true,
        last_sync: new Date().toISOString()
      })

    if (error) {
      console.error('[FactoryGuard] supOS equipment sync error:', error)
    } else {
      console.log('[FactoryGuard] Successfully synced equipment to supOS:', equipment.name)
    }
  } catch (error) {
    console.error('[FactoryGuard] Equipment sync error:', error)
  }
}

export async function syncAlertsWithSupOS(alert: any) {
  if (!suposConnected || !suposToken) {
    console.log('[FactoryGuard] supOS not connected - skipping alert sync')
    return
  }

  try {
    // Sync alert data with supOS via EventFlow
    console.log('[FactoryGuard] Syncing alert with supOS:', alert.message)

    const { suposDbClient } = await import('@/lib/supos/client')

    // Insert alert into supOS database
    const { data, error } = await suposDbClient
      .from('alerts')
      .insert({
        id: alert.id,
        equipment_id: alert.equipment_id,
        severity: alert.severity,
        type: alert.type,
        message: alert.message,
        recommended_action: alert.recommended_action,
        acknowledged: alert.acknowledged,
        acknowledged_by: alert.acknowledged_by,
        acknowledged_at: alert.acknowledged_at,
        resolved: alert.resolved,
        resolved_at: alert.resolved_at,
        metadata: alert.metadata,
        synced_from_factoryguard: true,
        created_at: alert.created_at
      })

    if (error) {
      console.error('[FactoryGuard] supOS alert sync error:', error)
    } else {
      console.log('[FactoryGuard] Successfully synced alert to supOS:', alert.message)
    }
  } catch (error) {
    console.error('[FactoryGuard] Alert sync error:', error)
  }
}

export async function syncPredictionsWithSupOS(prediction: any) {
  if (!suposConnected || !suposToken) {
    console.log('[FactoryGuard] supOS not connected - skipping prediction sync')
    return
  }

  try {
    // Sync prediction data with supOS via SQLEditor
    console.log('[FactoryGuard] Syncing prediction with supOS:', prediction.prediction_type)

    const { suposDbClient } = await import('@/lib/supos/client')

    // Insert prediction into supOS database
    const { data, error } = await suposDbClient
      .from('predictions')
      .insert({
        id: prediction.id,
        equipment_id: prediction.equipment_id,
        prediction_type: prediction.prediction_type,
        predicted_value: prediction.predicted_value,
        confidence: prediction.confidence,
        prediction_date: prediction.prediction_date,
        model_version: prediction.model_version,
        input_features: prediction.input_features,
        metadata: prediction.metadata,
        synced_from_factoryguard: true,
        created_at: prediction.created_at
      })

    if (error) {
      console.error('[FactoryGuard] supOS prediction sync error:', error)
    } else {
      console.log('[FactoryGuard] Successfully synced prediction to supOS:', prediction.prediction_type)
    }
  } catch (error) {
    console.error('[FactoryGuard] Prediction sync error:', error)
  }
}

// Initialize supOS integration on startup
initializeSupOSIntegration()

// Retry connection every 30 seconds if not connected
setInterval(() => {
  if (!suposConnected) {
    console.log('[FactoryGuard] Attempting to reconnect to supOS...')
    initializeSupOSIntegration()
  }
}, 30000)

console.log('[FactoryGuard] supOS integration service loaded')