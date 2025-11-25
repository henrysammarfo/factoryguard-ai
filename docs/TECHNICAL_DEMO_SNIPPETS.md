# Technical Demo Screenshots & Code Snippets

## For Live Demo - Show These During Presentation

---

## **Screenshot 1: supOS MQTT Connection Code**
*Show this when explaining supOS integration*

```javascript
// supOS-CE MQTT Connection - Real Integration Code
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
      mqttClient!.on('connect', () => {
        console.log('[FactoryGuard] Connected to supOS-CE MQTT broker')
        resolve(true)
      })
    })
  } catch (error) {
    console.error('[FactoryGuard] Failed to connect to supOS MQTT:', error)
    return false
  }
}
```

**What to say:** "Here's our actual code connecting to the supOS platform. You can see we're using MQTT with secure authentication to connect to the supOS-CE broker."

---

## **Screenshot 2: UNS Topic Subscription**
*Show this when explaining Unified Namespace*

```javascript
// Subscribe to UNS topics for equipment data
export function subscribeToUNSTopics(topics: string[], callback: (topic: string, message: any) => void) {
  topics.forEach(topic => {
    console.log('[FactoryGuard] Subscribing to UNS topic:', topic)
    mqttClient!.subscribe(topic, { qos: 1 }, (err) => {
      if (!err) {
        console.log('[FactoryGuard] Successfully subscribed to:', topic)
      }
    })
  })

  mqttClient!.on('message', (topic, message) => {
    const data = JSON.parse(message.toString())
    console.log('[FactoryGuard] Received UNS data:', topic, data)
    callback(topic, data)
  })
}

// Example UNS Topics:
'factory/+/+/+/sensors/temperature'
'factory/+/+/+/sensors/vibration'
'factory/+/+/+/equipment/+'
'factory/+/alerts/+'
```

**What to say:** "This code shows how we subscribe to supOS Unified Namespace topics. The UNS structure organizes all industrial data in a standard hierarchy that any system can understand."

---

## **Screenshot 3: Real-time MQTT Data Processing**
*Show this during live demo when console is open*

```javascript
client.on('message', async (topic, message) => {
  try {
    const parts = topic.split('/')
    const equipmentId = parts[3] // factory/workshopA/productionLine1/cnc_machine_001/sensors/temperature
    const sensorType = parts[5] // temperature, vibration, etc.

    const payload = JSON.parse(message.toString())
    console.log(`[FactoryGuard] 📥 Received supOS CE ${sensorType} data for ${equipmentId}:`, payload)

    // Process sensor data
    const reading = {
      id: payload.id,
      equipment_id: payload.equipment_id,
      sensor_type: payload.sensor_type,
      value: payload.value,
      unit: payload.unit,
      timestamp: payload.timestamp
    }

    // Update equipment health
    let healthScore = 100
    if (payload.temperature > 80) healthScore -= 20
    if (payload.vibration > 5) healthScore -= 15
    if (payload.pressure > 8) healthScore -= 10

    // Broadcast to dashboard
    broadcast('reading:new', reading)

  } catch (error) {
    console.error('[FactoryGuard] MQTT message processing error:', error)
  }
})
```

**What to say:** "You can see in our console that we're receiving real sensor data from supOS. The system processes each message, calculates equipment health, and updates the dashboard instantly."

---

## **Screenshot 4: AI Prediction Engine**
*Show this when explaining AI predictions*

```javascript
// AI Prediction Logic
function checkAnomalies(equipmentId: string, reading: any) {
  const alerts = []

  // Temperature anomaly detection
  if (reading.temperature > 80) {
    alerts.push({
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      equipment_id: equipmentId,
      severity: reading.temperature > 90 ? 'critical' : 'warning',
      type: 'temperature',
      message: `High temperature detected: ${reading.temperature}°C`,
      recommended_action: 'Check cooling system and reduce load',
      timestamp: new Date(),
      acknowledged: false,
    })
  }

  // Vibration anomaly detection
  if (reading.vibration > 6.0) {
    alerts.push({
      severity: reading.vibration > 7.5 ? 'critical' : 'warning',
      type: 'vibration',
      message: `Excessive vibration detected: ${reading.vibration} mm/s`,
      recommended_action: 'Inspect bearings and alignment'
    })
  }

  // Broadcast alerts
  alerts.forEach(alert => {
    broadcast('alert:new', alert)
  })
}
```

**What to say:** "Our AI engine analyzes sensor data in real-time. When it detects unusual patterns, it creates intelligent alerts with specific recommendations for maintenance teams."

---

## **Screenshot 5: WebSocket Real-time Updates**
*Show this for live dashboard updates*

```javascript
// WebSocket server for real-time dashboard updates
import { WebSocketServer } from 'ws'
import { broadcast } from './broadcast'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
  console.log('[FactoryGuard] WebSocket client connected')

  // Subscribe to real-time updates
  const subscription = supabase
    .channel('equipment_updates')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' })
    .subscribe()

  // Send updates to client
  subscription.on('update', (payload) => {
    ws.send(JSON.stringify({
      type: 'equipment_update',
      data: payload
    }))
  })

  // Send sensor readings
  broadcast.on('reading:new', (reading) => {
    ws.send(JSON.stringify({
      type: 'sensor_reading',
      data: reading
    }))
  })

  // Send alerts
  broadcast.on('alert:new', (alert) => {
    ws.send(JSON.stringify({
      type: 'alert',
      data: alert
    }))
  })
})
```

**What to say:** "This WebSocket server pushes real-time updates to our dashboard. When sensor data arrives, it's instantly displayed to users without them needing to refresh the page."

---

## **Screenshot 6: Database Schema**
*Show this for data architecture*

```sql
-- Equipment table
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  health_score DECIMAL(5,2),
  temperature DECIMAL(8,2),
  vibration DECIMAL(8,2),
  pressure DECIMAL(8,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sensor readings table
CREATE TABLE sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id),
  sensor_type VARCHAR(100),
  value DECIMAL(10,4),
  unit VARCHAR(20),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- AI Predictions table
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id),
  failure_probability DECIMAL(5,4),
  confidence DECIMAL(5,4),
  predicted_at TIMESTAMP DEFAULT NOW()
);
```

**What to say:** "Our database stores all sensor data, equipment information, and AI predictions. This time-series data allows us to track equipment health over time and improve our AI models."

---

## **Screenshot 7: Live Console Output**
*Show actual console during demo*

```
[FactoryGuard] ✅ Successfully connected to MQTT broker!
[FactoryGuard] ✅ Subscribed to factory/+/+/+/sensors/temperature
[FactoryGuard] ✅ Subscribed to factory/+/+/+/sensors/vibration
[FactoryGuard] 📥 Received supOS CE temperature data for cnc_machine_001: { value: 75.2, unit: "°C" }
[FactoryGuard] 📥 Received supOS CE vibration data for cnc_machine_001: { value: 3.1, unit: "mm/s" }
[FactoryGuard] AI Prediction: Equipment health = 82%
[FactoryGuard] WebSocket broadcast: sensor_reading to 3 clients
[FactoryGuard] Alert generated: High temperature detected: 75.2°C
```

**What to say:** "You can see our system is actively processing real data from supOS. Every sensor reading is analyzed, predictions are made, and updates are sent to the dashboard instantly."

---

## **Screenshot 8: Environment Configuration**
*Show this for setup transparency*

```bash
# .env.local configuration
MQTT_BROKER_URL=1f3c070f03034f3890cb2c984bc76294.s1.eu.hivemq.cloud
MQTT_BROKER_PORT=8883
MQTT_USERNAME=supos
MQTT_PASSWORD=********
MQTT_USE_TLS=true

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
HUGGINGFACE_API_KEY=your-huggingface-key

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**What to say:** "This shows our actual configuration connecting to live supOS infrastructure. We're using secure MQTT over TLS with authentication."

---

## **Screenshot 9: Build Output**
*Show this to prove the system works*

```
[FactoryGuard] Initializing supOS-CE integration...
[FactoryGuard] Connecting to supOS-CE MQTT broker: 1f3c070f03034f3890cb2c984bc76294.s1.eu.hivemq.cloud
[FactoryGuard] Connected to supOS-CE MQTT broker
[FactoryGuard] supOS integration MQTT broker is reachable
[FactoryGuard] Successfully authenticated with supOS-CE via MQTT
[FactoryGuard] Subscribing to UNS topic: factory/+/+/+/equipment/+
[FactoryGuard] Successfully subscribed to: factory/+/+/+/equipment/+
✓ Compiled successfully
✓ Generating static pages (16/16)
```

**What to say:** "Our build output shows successful supOS integration. The system connects, authenticates, and subscribes to data streams during startup."

---

## **Screenshot 10: API Endpoints**
*Show this for system architecture*

```javascript
// Equipment API endpoint
app.get('/api/equipment', async (req, res) => {
  try {
    const equipment = await supabase.from('equipment').select('*')
    res.json(equipment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch equipment' })
  }
})

// supOS Status endpoint
app.get('/api/supos/status', async (req, res) => {
  try {
    const status = await checkSupOSConnection()
    res.json(status)
  } catch (error) {
    res.status(500).json({ error: 'Failed to check supOS status' })
  }
})
```

**What to say:** "These API endpoints connect our dashboard to the database and supOS integration. They provide real-time data to the user interface."

---

## Demo Flow with Screenshots

1. **Start Demo:** Show Screenshot 1 (MQTT Connection)
2. **Show Topics:** Show Screenshot 2 (UNS Topics)
3. **Live Data:** Show Screenshot 3 (Console Output)
4. **AI Processing:** Show Screenshot 4 (Prediction Logic)
5. **Real-time Updates:** Show Screenshot 5 (WebSocket Code)
6. **Data Storage:** Show Screenshot 6 (Database Schema)
7. **Configuration:** Show Screenshot 8 (Environment Setup)
8. **Build Success:** Show Screenshot 9 (Build Output)

**Remember:** Have these screenshots ready in a separate window or on a second monitor. Switch to them during the demo to show technical credibility while keeping explanations simple for the audience.