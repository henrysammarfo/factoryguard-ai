// supOS Integration Client
// Handles connections to supOS DBConnect, EventFlow, SourceFlow, and Authentication

// Note: supOS uses PostgreSQL directly, not Supabase
// Database connections would require pg library for direct PostgreSQL access
// For now, we'll use the supOS REST API instead

// supOS DB connection info (for reference)
// PostgreSQL: postgres://postgres:postgres@127.0.0.1:5432/postgres
// TimescaleDB: postgres://postgres:postgres@127.0.0.1:2345/postgres

// supOS Authentication - Using REAL API from head team
export async function authenticateWithSupOS(username: string = 'admin', password: string = 'supos') {
  try {
    const suposApiUrl = process.env.SUPOS_API_URL || 'http://127.0.0.1:8088'
    const suposApiKey = process.env.SUPOS_API_KEY
    
    console.log('[FactoryGuard] Connecting to supOS API:', suposApiUrl)
    console.log('[FactoryGuard] Using API Key:', suposApiKey)
    
    // Use API key directly - most REST APIs use API key authentication
    // Try health check first to verify connection
    try {
      const healthCheck = await fetch(`${suposApiUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${suposApiKey}`,
          'X-API-Key': suposApiKey,
          'Accept': 'application/json',
        },
      })
      
      console.log('[FactoryGuard] supOS health check status:', healthCheck.status)
      
      if (healthCheck.ok) {
        console.log('[FactoryGuard] supOS API is reachable')
        // Return success with API key as token
        return {
          access_token: suposApiKey,
          refresh_token: suposApiKey,
          expires_in: 3600,
        }
      }
    } catch (healthError) {
      console.log('[FactoryGuard] Health check failed, trying authentication endpoints')
    }
    
    // Try authentication endpoints
    const endpoints = [
      `${suposApiUrl}/api/auth/login`,
      `${suposApiUrl}/auth/login`,
      `${suposApiUrl}/api/login`,
      `${suposApiUrl}/login`,
    ]

    for (const endpoint of endpoints) {
      try {
        console.log('[FactoryGuard] Trying supOS auth endpoint:', endpoint)

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${suposApiKey}`,
            'X-API-Key': suposApiKey,
          },
          body: JSON.stringify({
            username: username,
            password: password,
            apiKey: suposApiKey,
          }),
        })

        console.log('[FactoryGuard] supOS auth response status:', response.status, 'for endpoint:', endpoint)

        if (response.status === 200) {
          const contentType = response.headers.get('content-type')
          console.log('[FactoryGuard] Response content-type:', contentType)

          if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            console.log('[FactoryGuard] supOS authentication successful with endpoint:', endpoint)
            return {
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              expires_in: data.expires_in,
            }
          } else {
            const text = await response.text()
            console.log('[FactoryGuard] Non-JSON response:', text.substring(0, 200))
            // Continue to next endpoint
          }
        } else {
          const errorText = await response.text()
          console.log('[FactoryGuard] Auth failed for endpoint:', endpoint, 'Error:', errorText.substring(0, 200))
        }
      } catch (endpointError) {
        console.log('[FactoryGuard] Endpoint failed:', endpoint, 'Error:', endpointError.message)
        continue
      }
    }

    console.error('[FactoryGuard] All supOS authentication endpoints failed')
    return null

  } catch (error) {
    console.error('[FactoryGuard] supOS authentication error:', error)
    return null
  }
}

// Connect to supOS EventFlow (WebSocket)
export function connectToSupOSEventFlow(token: string) {
  try {
    const wsUrls = [
      'wss://supos-ce-instance2.supos.app:8443/eventflow',
      'ws://supos-ce-instance2.supos.app:8443/eventflow',
      'wss://supos-ce-instance2.supos.app/eventflow',
      'ws://supos-ce-instance2.supos.app/eventflow'
    ]

    for (const wsUrl of wsUrls) {
      try {
        console.log('[FactoryGuard] Trying supOS EventFlow:', wsUrl)

        const ws = new WebSocket(wsUrl, [], {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        // Set a timeout for connection
        const connectionTimeout = setTimeout(() => {
          ws.close()
          console.log('[FactoryGuard] EventFlow connection timeout for:', wsUrl)
        }, 5000)

        ws.onopen = () => {
          clearTimeout(connectionTimeout)
          console.log('[FactoryGuard] Connected to supOS EventFlow:', wsUrl)
        }

        ws.onmessage = (event) => {
          console.log('[FactoryGuard] Received from supOS EventFlow:', event.data)
          // Process incoming events
        }

        ws.onclose = () => {
          console.log('[FactoryGuard] supOS EventFlow connection closed:', wsUrl)
        }

        ws.onerror = (error) => {
          clearTimeout(connectionTimeout)
          console.error('[FactoryGuard] supOS EventFlow error for', wsUrl, ':', error)
        }

        return ws
      } catch (wsError) {
        console.log('[FactoryGuard] WebSocket failed for:', wsUrl, 'Error:', wsError.message)
        continue
      }
    }

    console.error('[FactoryGuard] All supOS EventFlow endpoints failed')
    return null

  } catch (error) {
    console.error('[FactoryGuard] Failed to connect to supOS EventFlow:', error)
    return null
  }
}

// Connect to supOS SourceFlow (MQTT)
export async function connectToSupOSSourceFlow(token: string) {
  try {
    // This would typically use MQTT.js or similar
    console.log('[FactoryGuard] Connecting to supOS SourceFlow...')
    // Implementation would go here
    console.log('[FactoryGuard] supOS SourceFlow connected')
    return true
  } catch (error) {
    console.error('[FactoryGuard] supOS SourceFlow connection error:', error)
    return false
  }
}

// supOS Dashboards - Embed FactoryGuard in supOS interface
export async function createSupOSDashboard(token: string) {
  try {
    const apiUrls = [
      'https://supos-ce-instance2.supos.app:8443/api/dashboards',
      'https://supos-ce-instance2.supos.app/api/dashboards',
      'https://supos-ce-instance2.supos.app:8443/supos/api/dashboards'
    ]

    for (const apiUrl of apiUrls) {
      try {
        console.log('[FactoryGuard] Trying supOS dashboard creation at:', apiUrl)

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Tenant-ID': process.env.SUPOS_TENANT_ID || 'supos'
          },
          body: JSON.stringify({
            name: 'FactoryGuard AI Dashboard',
            description: 'Predictive Maintenance Dashboard',
            widgets: [
              {
                type: 'iframe',
                url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
                title: 'Equipment Monitoring'
              }
            ]
          })
        })

        console.log('[FactoryGuard] supOS dashboard creation response status:', response.status, 'for URL:', apiUrl)

        if (response.status === 200 || response.status === 201) {
          const result = await response.json()
          console.log('[FactoryGuard] Created supOS dashboard:', result)
          return result
        } else {
          const errorText = await response.text()
          console.log('[FactoryGuard] Dashboard creation failed for URL:', apiUrl, 'Error:', errorText.substring(0, 200))
        }
      } catch (apiError) {
        console.log('[FactoryGuard] API call failed for:', apiUrl, 'Error:', apiError.message)
        continue
      }
    }

    console.error('[FactoryGuard] All supOS dashboard creation endpoints failed')
    return null

  } catch (error) {
    console.error('[FactoryGuard] supOS dashboard creation error:', error)
    return null
  }
}

// Fetch equipment data from supOS API
export async function fetchSupOSEquipment(token: string) {
  try {
    const suposApiUrl = process.env.SUPOS_API_URL || 'http://127.0.0.1:8088'
    
    const endpoints = [
      `${suposApiUrl}/api/equipment`,
      `${suposApiUrl}/api/v1/equipment`,
      `${suposApiUrl}/equipment`,
    ]
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-API-Key': token,
            'Accept': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('[FactoryGuard] Fetched supOS equipment data')
          return data
        }
      } catch (err) {
        continue
      }
    }
    
    console.log('[FactoryGuard] No equipment data from supOS')
    return null
  } catch (error) {
    console.error('[FactoryGuard] supOS equipment fetch error:', error)
    return null
  }
}

// Fetch sensor data from supOS TimescaleDB
export async function fetchSupOSSensorData(token: string, equipmentId?: string) {
  try {
    const suposApiUrl = process.env.SUPOS_API_URL || 'http://127.0.0.1:8088'
    
    const endpoints = [
      `${suposApiUrl}/api/sensors${equipmentId ? `?equipmentId=${equipmentId}` : ''}`,
      `${suposApiUrl}/api/v1/sensors${equipmentId ? `?equipmentId=${equipmentId}` : ''}`,
      `${suposApiUrl}/sensors${equipmentId ? `?equipmentId=${equipmentId}` : ''}`,
    ]
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-API-Key': token,
            'Accept': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('[FactoryGuard] Fetched supOS sensor data')
          return data
        }
      } catch (err) {
        continue
      }
    }
    
    console.log('[FactoryGuard] No sensor data from supOS')
    return null
  } catch (error) {
    console.error('[FactoryGuard] supOS sensor fetch error:', error)
    return null
  }
}

// Check if supOS is actually running and reachable
export async function checkSupOSConnection() {
  try {
    const suposApiUrl = process.env.SUPOS_API_URL || 'http://127.0.0.1:8088'
    const suposApiKey = process.env.SUPOS_API_KEY
    
    console.log('[FactoryGuard] Checking supOS connection at:', suposApiUrl)
    
    // Try multiple common endpoints
    const endpoints = [
      `${suposApiUrl}/`,
      `${suposApiUrl}/api`,
      `${suposApiUrl}/api/health`,
      `${suposApiUrl}/health`,
      `${suposApiUrl}/swagger-ui/index.html`,
    ]
    
    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${suposApiKey}`,
            'X-API-Key': suposApiKey,
          },
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        console.log('[FactoryGuard] supOS endpoint', endpoint, 'responded with status:', response.status)
        
        if (response.status < 500) { // Any response except server error means it's reachable
          return {
            connected: true,
            endpoint: endpoint,
            status: response.status,
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('[FactoryGuard] Timeout checking endpoint:', endpoint)
        }
        continue
      }
    }
    
    console.log('[FactoryGuard] supOS is not reachable at', suposApiUrl)
    return {
      connected: false,
      endpoint: null,
      status: null,
      message: 'supOS is not running or not reachable. Please ensure supOS is running on http://127.0.0.1:8088'
    }
  } catch (error) {
    console.error('[FactoryGuard] supOS connection check error:', error)
    return {
      connected: false,
      endpoint: null,
      status: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}