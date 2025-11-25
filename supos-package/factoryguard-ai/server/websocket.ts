// Load environment variables FIRST before any imports
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
console.log('[FactoryGuard] Loading environment from:', envPath)

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envLines = envContent.split('\n')

  envLines.forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '')
        process.env[key.trim()] = value.trim()
      }
    }
  })
  console.log('[FactoryGuard] Environment variables loaded successfully')
} else {
  console.log('[FactoryGuard] ERROR: .env.local file not found!')
}

console.log('[FactoryGuard] Environment Check:')
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET')

// Now import after environment is loaded
import { WebSocketServer } from 'ws'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { syncEquipmentWithSupOS, syncAlertsWithSupOS, syncPredictionsWithSupOS } from './supos-integration'
import { clients, broadcast } from './broadcast'

const port = process.env.PORT || 3001
const wss = new WebSocketServer({ port: parseInt(port.toString()) })

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

console.log(`[FactoryGuard] WebSocket server running on port ${port}`)

export default wss