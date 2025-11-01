'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from './supabase/client'

const supabase = getSupabaseBrowserClient()

export function useRealTimeData() {
  const [equipment, setEquipment] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial fetch
    fetchEquipment()
    fetchAlerts()

    // Subscribe to real-time updates
    const equipmentChannel = supabase
      .channel('equipment-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'equipment' },
        (payload) => {
          console.log('[FactoryGuard] Equipment updated:', payload)
          fetchEquipment()
        }
      )
      .subscribe()

    const alertsChannel = supabase
      .channel('alerts-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        (payload) => {
          console.log('[FactoryGuard] Alert updated:', payload)
          fetchAlerts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(equipmentChannel)
      supabase.removeChannel(alertsChannel)
    }
  }, [])

  async function fetchEquipment() {
    const { data, error } = await supabase
      .from('equipment')
      .select(`
        *,
        latest_reading:sensor_readings(*)
          .order('timestamp', { ascending: false })
          .limit(1)
      `)
      .order('name')

    if (error) {
      console.error('[FactoryGuard] Fetch equipment error:', error)
      return
    }

    setEquipment(data || [])
    setLoading(false)
  }

  async function fetchAlerts() {
    const { data, error } = await supabase
      .from('alerts')
      .select(`
        *,
        equipment:equipment(name, type, location)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('[FactoryGuard] Fetch alerts error:', error)
      return
    }

    setAlerts(data || [])
  }

  return { equipment, alerts, loading, refetch: () => {
    fetchEquipment()
    fetchAlerts()
  }}
}