import { WebSocketServer } from 'ws'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { syncEquipmentWithSupOS, syncAlertsWithSupOS, syncPredictionsWithSupOS } from './supos-integration'
import { clients, broadcast } from './broadcast'

const wss = new WebSocketServer({ port: 3001 })

wss.on('connection', (ws) => {
  console.log('[FactoryGuard] Client connected to WebSocket')
  clients.add(ws)

  ws.on('close', () => {
    console.log('[FactoryGuard] Client disconnected')
    clients.delete(ws)
  })

  ws.on('error', (error) => {
    console.error('[FactoryGuard] WebSocket error:', error)
    clients.delete(ws)
  })
})

// Re-export broadcast for backwards compatibility
export { broadcast }

// Subscribe to Supabase real-time changes
const equipmentChannel = supabaseAdmin
  .channel('equipment-changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'equipment' },
    async (payload) => {
      console.log('[FactoryGuard] Equipment change:', payload)
      broadcast('equipment:update', payload.new)

      // Sync with supOS if connected
      if (payload.new) {
        await syncEquipmentWithSupOS(payload.new)
      }
    }
  )
  .subscribe()

const alertsChannel = supabaseAdmin
  .channel('alerts-changes')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'alerts' },
    async (payload) => {
      console.log('[FactoryGuard] New alert:', payload)
      broadcast('alert:new', payload.new)

      // Sync with supOS if connected
      if (payload.new) {
        await syncAlertsWithSupOS(payload.new)
      }
    }
  )
  .subscribe()

const readingsChannel = supabaseAdmin
  .channel('readings-changes')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'sensor_readings' },
    (payload) => {
      console.log('[FactoryGuard] New sensor reading:', payload)
      broadcast('reading:new', payload.new)
    }
  )
  .subscribe()

const predictionsChannel = supabaseAdmin
  .channel('predictions-changes')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'predictions' },
    async (payload) => {
      console.log('[FactoryGuard] New prediction:', payload)
      broadcast('prediction:new', payload.new)

      // Sync with supOS if connected
      if (payload.new) {
        await syncPredictionsWithSupOS(payload.new)
      }
    }
  )
  .subscribe()

console.log('[FactoryGuard] WebSocket server running on ws://localhost:3001')

export default wss