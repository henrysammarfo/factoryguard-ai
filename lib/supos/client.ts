// supOS-CE Integration Client
// Real integration with supOS Community Edition via MQTT (UNS) and REST APIs

import mqtt from 'mqtt'

// supOS-CE configuration - uses same MQTT broker as sensor data for demo
const SUPOS_DEFAULTS = {
  MQTT_BROKER: process.env.MQTT_BROKER_URL || 'mqtt://127.0.0.1:1883',
  MQTT_USERNAME: process.env.MQTT_USERNAME || 'supos',
  MQTT_PASSWORD: process.env.MQTT_PASSWORD || 'supos',
  API_BASE: process.env.SUPOS_API_BASE || 'http://127.0.0.1:3000',
  NAMESPACE_PREFIX: process.env.SUPOS_NAMESPACE_PREFIX || 'factory'
}

// MQTT client for UNS (Unified Namespace) data
let mqttClient: mqtt.MqttClient | null = null
let unsSubscriptions: string[] = []

// supOS Authentication - Connect to supOS-CE platform
export async function authenticateWithSupOS(username: string = 'supos', password: string = 'supos') {
  try {
    console.log('[FactoryGuard] Authenticating with supOS-CE...')

    // supOS-CE uses simple authentication via MQTT broker
    // No complex REST API auth - just MQTT connection with credentials
    const authResult = await connectToSupOSMQTT()

    if (authResult) {
      console.log('[FactoryGuard] Successfully authenticated with supOS-CE via MQTT')
      return {
        access_token: 'mqtt_authenticated',
        refresh_token: 'mqtt_authenticated',
        expires_in: 3600,
        method: 'mqtt'
      }
    }

    console.error('[FactoryGuard] supOS-CE MQTT authentication failed')
    return null

  } catch (error) {
    console.error('[FactoryGuard] supOS authentication error:', error)
    return null
  }
}

// Connect to supOS-CE MQTT broker for UNS (Unified Namespace)
export async function connectToSupOSMQTT(): Promise<boolean> {
  try {
    console.log('[FactoryGuard] Connecting to supOS-CE MQTT broker:', SUPOS_DEFAULTS.MQTT_BROKER)

    mqttClient = mqtt.connect({
      host: SUPOS_DEFAULTS.MQTT_BROKER,
      port: parseInt(process.env.MQTT_BROKER_PORT || '8883'),
      username: SUPOS_DEFAULTS.MQTT_USERNAME,
      password: SUPOS_DEFAULTS.MQTT_PASSWORD,
      protocol: process.env.MQTT_USE_TLS === 'true' ? 'mqtts' : 'mqtt',
      clientId: `factoryguard-supos-${Date.now()}`,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 10000,
      rejectUnauthorized: true
    })

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.error('[FactoryGuard] supOS MQTT connection timeout')
        resolve(false)
      }, 10000)

      mqttClient!.on('connect', () => {
        clearTimeout(timeout)
        console.log('[FactoryGuard] Connected to supOS-CE MQTT broker')
        resolve(true)
      })

      mqttClient!.on('error', (error) => {
        clearTimeout(timeout)
        console.error('[FactoryGuard] supOS MQTT connection error:', error)
        resolve(false)
      })
    })

  } catch (error) {
    console.error('[FactoryGuard] Failed to connect to supOS MQTT:', error)
    return false
  }
}

// Subscribe to UNS topics for equipment data
export function subscribeToUNSTopics(topics: string[], callback: (topic: string, message: any) => void) {
  if (!mqttClient || !mqttClient.connected) {
    console.error('[FactoryGuard] MQTT client not connected')
    return false
  }

  try {
    topics.forEach(topic => {
      console.log('[FactoryGuard] Subscribing to UNS topic:', topic)
      mqttClient!.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error('[FactoryGuard] Failed to subscribe to topic:', topic, err)
        } else {
          unsSubscriptions.push(topic)
          console.log('[FactoryGuard] Successfully subscribed to:', topic)
        }
      })
    })

    mqttClient!.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString())
        console.log('[FactoryGuard] Received UNS data:', topic, data)
        callback(topic, data)
      } catch (err) {
        console.error('[FactoryGuard] Failed to parse UNS message:', err)
      }
    })

    return true
  } catch (error) {
    console.error('[FactoryGuard] Failed to subscribe to UNS topics:', error)
    return false
  }
}

// Publish data to UNS topics
export function publishToUNSTopic(topic: string, data: any): boolean {
  if (!mqttClient || !mqttClient.connected) {
    console.error('[FactoryGuard] MQTT client not connected')
    return false
  }

  try {
    const message = JSON.stringify(data)
    mqttClient!.publish(topic, message, { qos: 1, retain: false }, (err) => {
      if (err) {
        console.error('[FactoryGuard] Failed to publish to UNS topic:', topic, err)
      } else {
        console.log('[FactoryGuard] Published to UNS topic:', topic)
      }
    })
    return true
  } catch (error) {
    console.error('[FactoryGuard] Failed to publish to UNS topic:', error)
    return false
  }
}

// Disconnect from MQTT
export function disconnectFromSupOS() {
  if (mqttClient) {
    console.log('[FactoryGuard] Disconnecting from supOS-CE MQTT')
    mqttClient.end()
    mqttClient = null
    unsSubscriptions = []
  }
}

// Connect to supOS SourceFlow (MQTT) - this is the same as MQTT connection
export async function connectToSupOSSourceFlow(token: string) {
  console.log('[FactoryGuard] supOS SourceFlow uses MQTT broker - already connected via MQTT')
  return mqttClient && mqttClient.connected
}

// supOS Dashboards - Create Grafana dashboard integration
export async function createSupOSDashboard(token: string) {
  try {
    console.log('[FactoryGuard] Creating supOS-CE Grafana dashboard integration...')

    // supOS-CE uses Grafana for dashboards
    // We'll create a data source and dashboard configuration
    const grafanaUrl = process.env.SUPOS_GRAFANA_URL || 'http://127.0.0.1:3001'
    const grafanaApiKey = process.env.SUPOS_GRAFANA_API_KEY

    if (!grafanaApiKey) {
      console.log('[FactoryGuard] Grafana API key not configured - dashboard creation skipped')
      return { message: 'Grafana API key required for dashboard creation' }
    }

    // Create data source for FactoryGuard
    const dataSourcePayload = {
      name: 'FactoryGuard AI',
      type: 'influxdb', // Using InfluxDB type for time-series compatibility
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      access: 'proxy',
      jsonData: {
        httpMode: 'GET',
        queryType: 'query'
      }
    }

    const dsResponse = await fetch(`${grafanaUrl}/api/datasources`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grafanaApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataSourcePayload)
    })

    if (dsResponse.ok) {
      console.log('[FactoryGuard] Created Grafana data source for FactoryGuard')
    }

    // Create dashboard
    const dashboardPayload = {
      dashboard: {
        title: 'FactoryGuard AI - Predictive Maintenance',
        tags: ['factoryguard', 'predictive-maintenance', 'supos'],
        panels: [
          {
            title: 'Equipment Status',
            type: 'iframe',
            gridPos: { h: 8, w: 12, x: 0, y: 0 },
            options: {
              url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/equipment`
            }
          },
          {
            title: 'Analytics',
            type: 'iframe',
            gridPos: { h: 8, w: 12, x: 12, y: 0 },
            options: {
              url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/analytics`
            }
          }
        ]
      }
    }

    const dashResponse = await fetch(`${grafanaUrl}/api/dashboards/db`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grafanaApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dashboardPayload)
    })

    if (dashResponse.ok) {
      const result = await dashResponse.json()
      console.log('[FactoryGuard] Created supOS-CE Grafana dashboard:', result)
      return result
    } else {
      console.log('[FactoryGuard] Grafana dashboard creation failed')
      return { message: 'Dashboard creation failed - check Grafana configuration' }
    }

  } catch (error) {
    console.error('[FactoryGuard] supOS dashboard creation error:', error)
    return null
  }
}

// Fetch equipment data from supOS UNS (Unified Namespace)
export async function fetchSupOSEquipment(token: string) {
  try {
    console.log('[FactoryGuard] Fetching equipment data from supOS UNS...')

    // In supOS-CE, equipment data is published to UNS topics
    // We'll subscribe to equipment topics and collect data
    const equipmentTopics = [
      `${SUPOS_DEFAULTS.NAMESPACE_PREFIX}/+/equipment/+`,
      `${SUPOS_DEFAULTS.NAMESPACE_PREFIX}/equipment/+`
    ]

    const equipmentData: any[] = []

    const dataReceived = new Promise<any[]>((resolve) => {
      const timeout = setTimeout(() => {
        resolve(equipmentData)
      }, 5000) // Wait 5 seconds for data

      subscribeToUNSTopics(equipmentTopics, (topic, data) => {
        if (data.type === 'equipment' || topic.includes('equipment')) {
          equipmentData.push({
            id: data.id || topic.split('/').pop(),
            name: data.name || `Equipment ${equipmentData.length + 1}`,
            type: data.type || 'Unknown',
            location: data.location || 'Unknown',
            status: data.status || 'unknown',
            ...data
          })
        }
      })

      // Also try to request data via MQTT publish
      setTimeout(() => {
        publishToUNSTopic(`${SUPOS_DEFAULTS.NAMESPACE_PREFIX}/request/equipment`, {
          request: 'list_all',
          timestamp: new Date().toISOString()
        })
      }, 1000)
    })

    const result = await dataReceived
    console.log('[FactoryGuard] Fetched supOS equipment data:', result.length, 'items')
    return result.length > 0 ? result : null

  } catch (error) {
    console.error('[FactoryGuard] supOS equipment fetch error:', error)
    return null
  }
}

// Fetch sensor data from supOS UNS
export async function fetchSupOSSensorData(token: string, equipmentId?: string) {
  try {
    console.log('[FactoryGuard] Fetching sensor data from supOS UNS...')

    // Sensor data in UNS follows topic hierarchy
    const sensorTopics = equipmentId
      ? [`${SUPOS_DEFAULTS.NAMESPACE_PREFIX}/+/equipment/${equipmentId}/sensors/+`]
      : [`${SUPOS_DEFAULTS.NAMESPACE_PREFIX}/+/sensors/+`]

    const sensorData: any[] = []

    const dataReceived = new Promise<any[]>((resolve) => {
      const timeout = setTimeout(() => {
        resolve(sensorData)
      }, 5000)

      subscribeToUNSTopics(sensorTopics, (topic, data) => {
        if (data.sensor_value !== undefined || topic.includes('sensor')) {
          sensorData.push({
            id: data.id || topic.split('/').pop(),
            equipment_id: equipmentId || data.equipment_id,
            sensor_type: data.type || 'Unknown',
            value: data.value || data.sensor_value,
            unit: data.unit || 'Unknown',
            timestamp: data.timestamp || new Date().toISOString(),
            ...data
          })
        }
      })

      // Request sensor data
      setTimeout(() => {
        const requestTopic = equipmentId
          ? `${SUPOS_DEFAULTS.NAMESPACE_PREFIX}/request/sensors/${equipmentId}`
          : `${SUPOS_DEFAULTS.NAMESPACE_PREFIX}/request/sensors`
        publishToUNSTopic(requestTopic, {
          request: 'current_values',
          timestamp: new Date().toISOString()
        })
      }, 1000)
    })

    const result = await dataReceived
    console.log('[FactoryGuard] Fetched supOS sensor data:', result.length, 'items')
    return result.length > 0 ? result : null

  } catch (error) {
    console.error('[FactoryGuard] supOS sensor fetch error:', error)
    return null
  }
}

// Check if supOS integration is working (via MQTT broker)
export async function checkSupOSConnection() {
  try {
    console.log('[FactoryGuard] Checking supOS integration connection...')

    // Check MQTT broker connection (primary method for supOS integration)
    const mqttConnected = await connectToSupOSMQTT()

    if (mqttConnected) {
      console.log('[FactoryGuard] supOS integration MQTT broker is reachable')
      return {
        connected: true,
        method: 'mqtt',
        broker: SUPOS_DEFAULTS.MQTT_BROKER,
        message: 'Connected to supOS integration via MQTT broker'
      }
    }

    console.log('[FactoryGuard] supOS integration MQTT broker not reachable')
    return {
      connected: false,
      method: null,
      message: 'MQTT broker not accessible. Please check MQTT_BROKER_URL and credentials in .env.local'
    }
  } catch (error) {
    console.error('[FactoryGuard] supOS connection check error:', error)
    return {
      connected: false,
      method: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check supOS integration connection'
    }
  }
}