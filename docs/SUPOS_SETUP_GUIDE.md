# supOS Integration Setup Guide

## Quick Start - Import NodeRED Flows

### Step 1: Access supOS NodeRED

1. Open your supOS instance NodeRED interface
   - URL: `http://YOUR_SUPOS_IP:1880` (or the URL provided by supOS team)
   - Login if authentication is enabled

### Step 2: Import SourceFlow

1. In NodeRED, click the **hamburger menu** (top right) → **Import**
2. Click **"select a file to import"**
3. Navigate to: `factoryguard-ai/supos-flows/source-flow-complete.json`
4. Click **Import**
5. You should see a new tab called **"FactoryGuard SourceFlow"**
6. Click **Deploy** (top right red button)

**What this flow does:**
- ✅ Subscribes to `factory/equipment/+` for equipment data
- ✅ Subscribes to `factory/+/+/+/sensors/+` for sensor data
- ✅ Shows incoming data in debug panel
- ✅ Formats data for PostgreSQL and TimescaleDB

### Step 3: Import EventFlow

1. Click **hamburger menu** → **Import** again
2. Select file: `factoryguard-ai/supos-flows/event-flow-complete.json`
3. Click **Import**
4. You should see a new tab called **"FactoryGuard EventFlow"**
5. Click **Deploy**

**What this flow does:**
- ✅ Monitors sensor data for threshold violations
- ✅ Generates alerts when thresholds exceeded
- ✅ Publishes alerts to `factory/alerts/active`
- ✅ Shows alerts in debug panel

### Step 4: Verify Connection

1. Open the **Debug** panel (bug icon on right sidebar)
2. Go to FactoryGuard dashboard: https://factoryguard-ai.vercel.app/dashboard/supos
3. Click **"Test MQTT Publish"** button
4. Switch back to NodeRED
5. You should see messages appearing in the debug panel!

---

## MQTT Broker Configuration

The flows are pre-configured to use the HiveMQ cloud broker already set up in FactoryGuard:

```
Broker: 1f3c070f03034f3890cb2c984bc76294.s1.eu.hivemq.cloud
Port: 8883 (TLS)
Username: factoryguard_client
Password: Dogbytec@r1
```

**No additional MQTT setup required!** The flows will connect automatically.

---

## Database Integration (Optional)

If you want to store data in supOS databases:

### PostgreSQL (Port 5432)

Replace the "PostgreSQL Write" debug node with a postgres node:

```sql
INSERT INTO equipment (id, name, type, status, health_score, location, updated_at)
VALUES ($equipment_id, $name, $type, $status, $health_score, $location, $timestamp)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  health_score = EXCLUDED.health_score,
  updated_at = EXCLUDED.updated_at
```

Connection string: `postgres://postgres:postgres@YOUR_IP:5432/postgres`

### TimescaleDB (Port 2345)

Replace the "TimescaleDB Write" debug node with a postgres node:

```sql
INSERT INTO sensor_readings (equipment_id, sensor_type, value, unit, timestamp)
VALUES ($equipment_id, $sensor_type, $value, $unit, $timestamp)
```

Connection string: `postgres://postgres:postgres@YOUR_IP:2345/postgres`

---

## Troubleshooting

### Flows show "disconnected" status

1. Check MQTT broker credentials in flow configuration
2. Verify internet connection (HiveMQ is cloud-based)
3. Click **Deploy** again

### No data appearing in debug panel

1. Make sure FactoryGuard backend services are running:
   ```bash
   npm run server:all
   ```
2. Check that MQTT listener is publishing data
3. Verify topic names match in both systems

### Can't import flows

1. Make sure you're copying the entire JSON file content
2. Try using "clipboard" import instead of file import
3. Check NodeRED version compatibility

---

## Taking Screenshots for Demo

### SourceFlow Screenshot

1. Click on **"FactoryGuard SourceFlow"** tab
2. Make sure all nodes are connected (green status)
3. Take screenshot showing:
   - MQTT In nodes (Equipment Data, Sensor Data)
   - Debug nodes
   - Database write nodes
   - All connections visible

### EventFlow Screenshot

1. Click on **"FactoryGuard EventFlow"** tab
2. Make sure all nodes are connected
3. Take screenshot showing:
   - MQTT In node (Sensor Events)
   - Threshold Check function
   - Alert Publisher (MQTT Out)
   - Debug nodes
   - All connections visible

### Debug Output Screenshot

1. Open Debug panel
2. Click "Test MQTT Publish" in FactoryGuard dashboard
3. Wait for messages to appear
4. Take screenshot showing:
   - Multiple debug messages
   - Equipment and sensor data
   - Timestamps
   - Connected status

---

## What to Show the supOS Team

✅ **SourceFlow tab** - Shows data coming FROM FactoryGuard TO supOS
✅ **EventFlow tab** - Shows alerts going FROM supOS TO FactoryGuard  
✅ **Debug panel** - Shows live data transmission
✅ **Connected status** - Green indicators on MQTT nodes
✅ **Deployed status** - "Deployed" message in top bar

This proves bidirectional integration is working!
