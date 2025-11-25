import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import next from 'next'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { syncEquipmentWithSupOS, syncAlertsWithSupOS, syncPredictionsWithSupOS } from './supos-integration'
import { clients, broadcast } from './broadcast'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000')

// Initialize Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      await handle(req, res)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Create WebSocket server on the same port
  const wss = new WebSocketServer({ server })

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

  // Start server
  server.listen(port, () => {
    console.log(`[FactoryGuard] Production server running on http://localhost:${port}`)
    console.log(`[FactoryGuard] WebSocket server running on ws://localhost:${port}`)
  })

  // Start all backend services
  console.log('[FactoryGuard] Starting backend services...')
  import('./mqtt-listener')
  import('./ai-predictor')
  import('./supos-sync')      // supOS MQTT publisher
  import('./supos-db-sync')   // supOS database writer
  console.log('[FactoryGuard] All services started successfully')
})

export default app
