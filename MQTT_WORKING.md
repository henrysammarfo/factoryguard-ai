# ✅ MQTT IS NOW FULLY WORKING!

## 🎉 What's Fixed

MQTT is now configured to connect to your **HiveMQ Cloud** broker and will:
- ✅ Connect to HiveMQ Cloud automatically
- ✅ Subscribe to sensor topics
- ✅ Receive real-time sensor data
- ✅ Store data in Supabase
- ✅ Broadcast updates via WebSocket
- ✅ Create alerts for anomalies

---

## 🔧 Configuration

Your MQTT broker is configured in `.env.local`:

```env
MQTT_BROKER_URL=your_mqtt_broker_url
MQTT_BROKER_PORT=8883
MQTT_USERNAME=your_mqtt_username
MQTT_PASSWORD=your_mqtt_password
MQTT_USE_TLS=true
```

**Note**: Use your own MQTT broker credentials (e.g., HiveMQ Cloud, AWS IoT, etc.)

---

## 🚀 How to Test

### Step 1: Start All Services

```bash
npm run server:all
```

You should see:
```
[2] [FactoryGuard] Connecting to MQTT broker: your-broker-url:8883
[2] [FactoryGuard] MQTT listener service started - waiting for connection...
[2] [FactoryGuard] ✅ Successfully connected to MQTT broker!
[2] [FactoryGuard] ✅ Subscribed to sensors/+/temperature
[2] [FactoryGuard] ✅ Subscribed to sensors/+/vibration
[2] [FactoryGuard] ✅ Subscribed to sensors/+/pressure
[2] [FactoryGuard] ✅ Subscribed to sensors/+/energy
[2] [FactoryGuard] ✅ Subscribed to sensors/+/all
```

### Step 2: Publish Test Data

Open a **new terminal** and run:

```bash
npm run test:mqtt
```

This will:
- Connect to HiveMQ Cloud
- Publish sensor data every 5 seconds
- Simulate equipment: `CNC-001`

You should see:
```
✅ Connected to MQTT broker!
📤 Published to sensors/CNC-001/all: { temperature: 75.3, vibration: 5.2, ... }
```

### Step 3: Watch the Data Flow

In your main terminal (where `server:all` is running), you'll see:
```
[2] [FactoryGuard] Received all data for CNC-001: { temperature: 75.3, ... }
[2] [FactoryGuard] New sensor reading: { equipment_id: 'CNC-001', ... }
```

### Step 4: Check the Dashboard

1. Open browser: `http://localhost:3000`
2. Login/Signup
3. Go to Dashboard
4. You should see **real-time sensor data** updating!

---

## 📊 What Happens When Data Arrives

```
MQTT Broker (HiveMQ Cloud)
    ↓
MQTT Listener receives message
    ↓
Parse sensor data
    ↓
Store in Supabase database
    ↓
Broadcast via WebSocket
    ↓
Frontend updates in real-time
    ↓
Check for anomalies
    ↓
Create alerts if needed
```

---

## 🎯 Sensor Topics

The MQTT listener subscribes to:

- `sensors/+/temperature` - Temperature readings
- `sensors/+/vibration` - Vibration readings
- `sensors/+/pressure` - Pressure readings
- `sensors/+/energy` - Energy consumption
- `sensors/+/all` - All sensor data at once

**Format**: `sensors/{equipment_id}/{metric}`

Example: `sensors/CNC-001/all`

---

## 📤 Publishing Data

### Manual Test (using test script):

```bash
npm run test:mqtt
```

### Custom MQTT Client:

```javascript
const mqtt = require('mqtt')
require('dotenv').config({ path: '.env.local' })

const client = mqtt.connect({
  host: process.env.MQTT_BROKER_URL,
  port: parseInt(process.env.MQTT_BROKER_PORT),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  protocol: 'mqtts',
})

client.on('connect', () => {
  const data = {
    temperature: 75.5,
    vibration: 5.2,
    pressure: 7.1,
    energy: 48.3,
    rpm: 2950,
    load: 82
  }
  
  client.publish('sensors/CNC-001/all', JSON.stringify(data))
})
```

### Using MQTT Explorer:

1. Download: https://mqtt-explorer.com/
2. Connect to your MQTT broker:
   - Host: (from `.env.local`)
   - Port: `8883`
   - Protocol: `mqtts://`
   - Username: (from `.env.local`)
   - Password: (from `.env.local`)
3. Publish to: `sensors/CNC-001/all`

---

## 🔍 Troubleshooting

### MQTT Not Connecting?

Check console for:
```
[2] [FactoryGuard] ✅ Successfully connected to MQTT broker!
```

If you see errors:
- ✅ Check `.env.local` has correct credentials
- ✅ Verify HiveMQ Cloud is accessible
- ✅ Check firewall/network settings

### No Data Appearing?

1. **Check MQTT listener is running**:
   ```
   [2] [FactoryGuard] MQTT listener service started
   ```

2. **Publish test data**:
   ```bash
   npm run test:mqtt
   ```

3. **Check Supabase connection**:
   - Verify `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
   - Check Supabase dashboard for new rows

---

## ✅ Status

| Component | Status | Details |
|-----------|--------|---------|
| **MQTT Broker** | 🟢 LIVE | HiveMQ Cloud |
| **MQTT Listener** | 🟢 LIVE | Subscribed to topics |
| **Data Storage** | 🟢 LIVE | Supabase PostgreSQL |
| **WebSocket** | 🟢 LIVE | Real-time broadcast |
| **Alerts** | 🟢 LIVE | Anomaly detection |
| **Test Publisher** | 🟢 READY | `npm run test:mqtt` |

---

## 🎉 Summary

**MQTT is fully functional!**

- ✅ Connects to HiveMQ Cloud
- ✅ Receives sensor data
- ✅ Stores in database
- ✅ Updates dashboard in real-time
- ✅ Creates alerts automatically
- ✅ Test script included

**Run `npm run server:all` and `npm run test:mqtt` to see it in action!** 🚀
