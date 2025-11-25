import { WebSocket } from 'ws'

export const clients = new Set<WebSocket>()

// Broadcast to all connected clients
export function broadcast(event: string, data: any) {
  const message = JSON.stringify({ event, data, timestamp: new Date().toISOString() })

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

// Broadcast equipment updates
export function broadcastEquipmentUpdate(event: string, equipment: any) {
  broadcast(event, equipment)
}
