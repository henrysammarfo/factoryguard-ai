'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

interface SupOSStatus {
  success: boolean
  supos_connected: boolean
  eventflow_connected: boolean
  authenticated: boolean
  timestamp: string
}

export default function SupOSDashboard() {
  const [status, setStatus] = useState<SupOSStatus | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/supos/status')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Failed to fetch supOS status:', error)
    } finally {
      setLoading(false)
    }
  }

  const connectToSupOS = async () => {
    setConnecting(true)
    try {
      const response = await fetch('/api/supos/connect', {
        method: 'POST'
      })
      const data = await response.json()

      if (data.success) {
        alert('Successfully connected to supOS!')
        fetchStatus() // Refresh status
      } else {
        alert(`Connection failed: ${data.message}`)
      }
    } catch (error) {
      console.error('Failed to connect to supOS:', error)
      alert('Connection failed. Check console for details.')
    } finally {
      setConnecting(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">supOS-CE Integration Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage FactoryGuard AI's connection to supOS Community Edition
          </p>
        </div>
        <Button
          onClick={connectToSupOS}
          disabled={connecting}
          className="flex items-center gap-2"
        >
          {connecting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {connecting ? 'Connecting...' : 'Connect to supOS'}
        </Button>
      </div>

      {/* Connection Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">supOS Connection</CardTitle>
            {status?.supos_connected ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status?.supos_connected ? 'Connected' : 'Disconnected'}
            </div>
            <p className="text-xs text-muted-foreground">
              Overall supOS platform connection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authentication</CardTitle>
            {status?.authenticated ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status?.authenticated ? 'Authenticated' : 'Not Authenticated'}
            </div>
            <p className="text-xs text-muted-foreground">
              Keycloak SSO status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EventFlow</CardTitle>
            {status?.eventflow_connected ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status?.eventflow_connected ? 'Connected' : 'Disconnected'}
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time event streaming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SourceFlow</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Connected via MQTT
            </p>
          </CardContent>
        </Card>
      </div>

      {/* supOS Components Status */}
      <Card>
        <CardHeader>
          <CardTitle>supOS-CE Components Integration</CardTitle>
          <CardDescription>
            Status of FactoryGuard AI integration with supOS Community Edition components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">DBConnect</h4>
                <p className="text-sm text-muted-foreground">PostgreSQL & TimescaleDB connection</p>
              </div>
              <Badge variant={status?.supos_connected ? "default" : "destructive"}>
                {status?.supos_connected ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">EventFlow</h4>
                <p className="text-sm text-muted-foreground">Real-time data streaming</p>
              </div>
              <Badge variant={status?.eventflow_connected ? "default" : "destructive"}>
                {status?.eventflow_connected ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">SourceFlow</h4>
                <p className="text-sm text-muted-foreground">PLC/SCADA connectivity</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Authentication</h4>
                <p className="text-sm text-muted-foreground">Keycloak SSO integration</p>
              </div>
              <Badge variant={status?.authenticated ? "default" : "destructive"}>
                {status?.authenticated ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Dashboards</h4>
                <p className="text-sm text-muted-foreground">Embedded FactoryGuard views</p>
              </div>
              <Badge variant="secondary">Auto-created</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">SQLEditor</h4>
                <p className="text-sm text-muted-foreground">Advanced analytics queries</p>
              </div>
              <Badge variant="secondary">Available</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>supOS-CE Connection Instructions</CardTitle>
          <CardDescription>
            Steps to fully integrate FactoryGuard AI with supOS Community Edition
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Install supOS-CE</h4>
            <p className="text-sm text-muted-foreground">
              Clone and install supOS-CE from GitHub: https://github.com/FREEZONEX/supOS-CE
              Follow the deployment guide for Docker setup.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">2. Configure UNS (Unified Namespace)</h4>
            <p className="text-sm text-muted-foreground">
              Set up MQTT broker and create factory equipment hierarchy topics.
              Default MQTT: mqtt://127.0.0.1:1883 with credentials supos/supos
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">3. Node-RED Flows</h4>
            <p className="text-sm text-muted-foreground">
              Configure Node-RED (port 1880) for data ingestion and processing.
              Create flows to publish equipment and sensor data to UNS topics.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">4. TimescaleDB Setup</h4>
            <p className="text-sm text-muted-foreground">
              Configure TimescaleDB (port 2345) for time-series sensor data storage.
              FactoryGuard will subscribe to UNS topics for real-time monitoring.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">5. Grafana Integration</h4>
            <p className="text-sm text-muted-foreground">
              Access Grafana (port 3001) for dashboard creation and visualization.
              FactoryGuard can embed views in Grafana dashboards.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {status?.timestamp ? new Date(status.timestamp).toLocaleString() : 'Never'}
      </div>
    </div>
  )
}