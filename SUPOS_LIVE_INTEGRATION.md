# ✅ supOS LIVE Integration - Complete Setup

## 🎯 What's Been Built (REAL & WORKING)

### 1. **MQTT Data Publishing** (`server/supos-sync.ts`)
- Publishes equipment data to `factory/equipment/{id}` every 10 seconds
- Publishes sensor data to `factory/{workshop}/{line}/{equipment}/sensors/{type}` every 10 seconds
- Uses HiveMQ cloud broker (already configured)

### 2. **DATABASE SYNC SERVICE** (`server/supos-db-sync.ts`) ⭐ NEW!
- **Writes to REAL supOS PostgreSQL** (port 5432)
- **Writes to REAL supOS TimescaleDB** (port 2345)
- Auto-creates tables if they don't exist
- Syncs equipment data every 15 seconds
- Syncs sensor readings every 15 seconds

### 3. **NodeRED Flows** (Ready to Import)
- `supos-flows/source-flow-complete.json` - Equipment & sensor ingestion
- `supos-flows/event-flow-complete.json` - Threshold monitoring & alerts

---

## 🚀 How to Run (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start ALL Services
```bash
npm run server:all
```

This starts:
- ✅ Frontend (localhost:3000)
- ✅ WebSocket server
- ✅ MQTT listener
- ✅ AI predictor
- ✅ **MQTT sync to supOS** (publishes to MQTT topics)
- ✅ **DATABASE sync to supOS** (writes to PostgreSQL + TimescaleDB)

### Step 3: Import Flows into supOS NodeRED

1. Go to: https://supos-ce-instance2.supos.app:8443
2. Login: `supos` / `supos`
3. Navigate to **UNS** → **Source Flow**
4. Click hamburger menu → Import
5. Import `supos-flows/source-flow-complete.json`
6. Click **Deploy**
7. Repeat for **Event Flow** with `event-flow-complete.json`

---

## 🔍 How to Verify It's Working

### Check MQTT Data Flow
1. In supOS NodeRED, open **Debug panel** (bug icon)
2. You should see equipment and sensor data flowing in
3. Messages appear every 10 seconds

### Check Database Writes
1. Access supOS SQL Editor or connect to databases:
   - PostgreSQL: `postgres://postgres:postgres@supos-ce-instance2.supos.app:5432/postgres`
   - TimescaleDB: `postgres://postgres:postgres@supos-ce-instance2.supos.app:2345/postgres`

2. Query equipment table:
   ```sql
   SELECT * FROM equipment ORDER BY updated_at DESC LIMIT 10;
   ```

3. Query sensor readings:
   ```sql
   SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT 20;
   ```

---

## 📊 What Data is Being Synced

### Equipment Data (PostgreSQL)
- Equipment ID, name, type, status
- Health score
- Location
- Real-time sensor values (temperature, vibration, pressure, energy, RPM, load)
- Last updated timestamp

### Sensor Readings (TimescaleDB)
- Equipment ID
- Sensor type (temperature, vibration, pressure, energy, rpm, load)
- Value and unit
- Timestamp (time-series optimized)

---

## 🔧 Configuration

All configuration is in `.env.local`:

```env
# supOS Instance
SUPOS_BASE_URL=https://supos-ce-instance2.supos.app:8443
SUPOS_API_KEY=4174348a-9222-4e81-b33e-5d72d2fd7f1e

# supOS Databases (LIVE)
SUPOS_POSTGRES_URL=postgres://postgres:postgres@supos-ce-instance2.supos.app:5432/postgres
SUPOS_TSDB_URL=postgres://postgres:postgres@supos-ce-instance2.supos.app:2345/postgres

# MQTT Broker (HiveMQ Cloud)
MQTT_BROKER_URL=1f3c070f03034f3890cb2c984bc76294.s1.eu.hivemq.cloud
MQTT_BROKER_PORT=8883
MQTT_USERNAME=factoryguard_client
MQTT_PASSWORD=Dogbytec@r1
```

---

## 📸 What to Show supOS Team

### 1. NodeRED Flows
- Screenshot of SourceFlow with all nodes connected
- Screenshot of EventFlow with threshold logic
- Screenshot of Debug panel showing live data

### 2. Database Evidence
- Screenshot of equipment table with recent data
- Screenshot of sensor_readings table with timestamps
- Show `updated_at` and `timestamp` columns proving real-time sync

### 3. Running Services
- Terminal showing all 6 services running
- Console logs showing database writes
- MQTT publish confirmations

---

## ⚡ Quick Test

Run this to test the database sync immediately:

```bash
npm run server:db
```

Watch the console - you should see:
```
[FactoryGuard] ✅ Connected to supOS PostgreSQL
[FactoryGuard] ✅ Connected to supOS TimescaleDB
[FactoryGuard] ✅ Equipment table ready in PostgreSQL
[FactoryGuard] ✅ Sensor readings table ready in TimescaleDB
[FactoryGuard] 💾 Synced equipment to PostgreSQL: Main Conveyor Motor
[FactoryGuard] 💾 Synced sensor to TimescaleDB: temperature = 68
```

---

## 🎯 Success Criteria

- ✅ All 6 services running (`npm run server:all`)
- ✅ MQTT data publishing every 10 seconds
- ✅ Database writes every 15 seconds
- ✅ NodeRED flows imported and deployed
- ✅ Debug panel shows live data
- ✅ PostgreSQL has equipment records
- ✅ TimescaleDB has sensor readings
- ✅ Timestamps are current (not fake/old data)

---

**This is REAL, LIVE integration - not a demo!** 🎉
