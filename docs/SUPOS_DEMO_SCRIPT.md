# supOS Integration Demo Script

## Objective
Demonstrate live, bidirectional data flow between FactoryGuard AI and supOS platform using NodeRED SourceFlow and EventFlow.

---

## Pre-Demo Setup (5 minutes)

### 1. Start FactoryGuard Services
```bash
cd factoryguard-ai
npm run server:all
```

Wait for all services to start:
- ✅ Next.js frontend (localhost:3000)
- ✅ WebSocket server
- ✅ MQTT listener
- ✅ AI predictor
- ✅ **supOS sync service** (NEW!)

### 2. Import NodeRED Flows into supOS

**Access NodeRED:**
- Open: `http://YOUR_SUPOS_IP:1880`
- Login if required

**Import SourceFlow:**
1. Click hamburger menu → Import
2. Select file: `supos-flows/source-flow-complete.json`
3. Click Import
4. Click Deploy (red button, top right)

**Import EventFlow:**
1. Click hamburger menu → Import
2. Select file: `supos-flows/event-flow-complete.json`
3. Click Import
4. Click Deploy

**Verify:**
- Both tabs visible: "FactoryGuard SourceFlow" and "FactoryGuard EventFlow"
- All MQTT nodes show "connected" status (green dot)

---

## Demo Flow (10 minutes)

### Part 1: Show SourceFlow (Data FROM FactoryGuard TO supOS)

**What to say:**
> "FactoryGuard AI continuously monitors industrial equipment and publishes data to supOS via MQTT. Let me show you the SourceFlow that receives this data."

**Actions:**
1. **In NodeRED**, click on **"FactoryGuard SourceFlow"** tab
2. **Point out the nodes:**
   - "Equipment Data" (MQTT In) - receives equipment status
   - "Sensor Data" (MQTT In) - receives sensor readings
   - "Equipment Debug" - displays equipment data
   - "Sensor Debug" - displays sensor readings
   - "Format for DB" - prepares data for PostgreSQL
   - "Format for TSDB" - prepares data for TimescaleDB

3. **Open Debug panel** (bug icon on right sidebar)

4. **In FactoryGuard dashboard** (https://factoryguard-ai.vercel.app/dashboard/supos):
   - Click **"Test MQTT Publish"** button

5. **Switch back to NodeRED**
   - Show messages appearing in debug panel
   - Point out equipment and sensor data flowing in real-time

**What to say:**
> "As you can see, equipment status and sensor data from FactoryGuard is flowing into supOS through the SourceFlow. This data can be stored in PostgreSQL for equipment metadata and TimescaleDB for time-series sensor data."

---

### Part 2: Show EventFlow (Alerts FROM supOS TO FactoryGuard)

**What to say:**
> "The EventFlow monitors sensor data and generates alerts when thresholds are exceeded. These alerts are sent back to FactoryGuard for action."

**Actions:**
1. **In NodeRED**, click on **"FactoryGuard EventFlow"** tab
2. **Point out the nodes:**
   - "Sensor Events" (MQTT In) - monitors all sensor data
   - "Threshold Check" (Function) - applies business rules
   - "Alert Publisher" (MQTT Out) - sends alerts to FactoryGuard
   - "Alert Debug" - shows generated alerts

3. **Explain the threshold logic:**
   - Temperature > 80°C = Warning
   - Temperature > 90°C = Critical
   - Vibration > 5.0 mm/s = Warning
   - Vibration > 7.0 mm/s = Critical
   - (Similar for pressure, energy, RPM, load)

4. **Show it in action:**
   - Wait for sensor data to flow through
   - If a threshold is exceeded, show the alert in debug panel
   - Point out the alert being published back to FactoryGuard

**What to say:**
> "The EventFlow acts as an intelligent monitoring layer in supOS. It processes sensor data, detects anomalies, and automatically generates alerts that FactoryGuard can act upon."

---

### Part 3: Show Bidirectional Integration

**What to say:**
> "This demonstrates true bidirectional integration. Data flows both ways - FactoryGuard sends equipment and sensor data to supOS, and supOS sends alerts back to FactoryGuard."

**Actions:**
1. **Split screen or switch between:**
   - NodeRED (showing flows and debug output)
   - FactoryGuard dashboard (showing equipment status and alerts)

2. **Point out the data flow:**
   - Equipment data: FactoryGuard → MQTT → supOS SourceFlow
   - Sensor data: FactoryGuard → MQTT → supOS SourceFlow
   - Alerts: supOS EventFlow → MQTT → FactoryGuard

3. **Show the connection status:**
   - In FactoryGuard dashboard → supOS page
   - All indicators should be green
   - Show "Connected" status

---

## Screenshots to Capture

### Screenshot 1: SourceFlow Overview
- **File**: `sourceflow_overview.png`
- **Content**: Full SourceFlow tab showing all nodes and connections
- **Annotations**: Label each node type

### Screenshot 2: EventFlow Overview
- **File**: `eventflow_overview.png`
- **Content**: Full EventFlow tab showing all nodes and connections
- **Annotations**: Label threshold check logic

### Screenshot 3: Debug Output
- **File**: `debug_output.png`
- **Content**: Debug panel showing live data flowing through
- **Annotations**: Highlight equipment data and sensor readings

### Screenshot 4: Alert Generation
- **File**: `alert_generation.png`
- **Content**: Debug panel showing alert being generated and published
- **Annotations**: Show threshold exceeded and alert details

### Screenshot 5: FactoryGuard Dashboard
- **File**: `factoryguard_supos_status.png`
- **Content**: supOS integration page showing all green status indicators
- **Annotations**: Highlight connection status

---

## Talking Points

### Technical Integration
- ✅ **MQTT-based communication** - Industry standard for IoT
- ✅ **UNS (Unified Namespace)** - ISA-95 compliant topic hierarchy
- ✅ **Real-time data streaming** - Sub-second latency
- ✅ **Bidirectional flow** - Data and alerts flow both ways
- ✅ **Database integration ready** - PostgreSQL and TimescaleDB support

### Business Value
- ✅ **Centralized monitoring** - All equipment data in supOS
- ✅ **Intelligent alerting** - Automated threshold monitoring
- ✅ **Predictive maintenance** - AI-powered failure prediction
- ✅ **Reduced downtime** - Early warning system
- ✅ **Cost savings** - Optimized maintenance scheduling

### supOS Integration Features
- ✅ **SourceFlow** - Data ingestion from external systems
- ✅ **EventFlow** - Event processing and alerting
- ✅ **DBConnect** - Database integration (PostgreSQL + TimescaleDB)
- ✅ **NodeRED** - Visual flow programming
- ✅ **MQTT** - Lightweight messaging protocol

---

## Q&A Preparation

**Q: How does FactoryGuard connect to supOS?**
A: Through MQTT messaging using a cloud-based HiveMQ broker. The flows subscribe to equipment and sensor topics published by FactoryGuard.

**Q: Can this work with local supOS installation?**
A: Yes! The flows can be configured to use a local MQTT broker running on the supOS instance (typically port 1883).

**Q: What about database integration?**
A: The flows include placeholder nodes for PostgreSQL (port 5432) and TimescaleDB (port 2345). These can be activated by installing the node-red-contrib-postgres package and configuring the connection strings.

**Q: How is data secured?**
A: MQTT connections use TLS encryption (port 8883) with username/password authentication. Database connections use standard PostgreSQL authentication.

**Q: Can we customize the threshold values?**
A: Absolutely! The Threshold Check function node can be edited to adjust warning and critical levels for each sensor type.

**Q: What happens if the connection is lost?**
A: MQTT has built-in reconnection logic. The flows will automatically reconnect when the broker becomes available again.

---

## Success Criteria

✅ SourceFlow visible in NodeRED with all nodes connected
✅ EventFlow visible in NodeRED with all nodes connected  
✅ Debug panel shows live data flowing through
✅ Equipment data appears in SourceFlow debug
✅ Sensor data appears in SourceFlow debug
✅ Alerts generated when thresholds exceeded
✅ Alerts published to FactoryGuard topic
✅ All MQTT nodes show "connected" status
✅ FactoryGuard dashboard shows green status indicators

---

## Troubleshooting During Demo

**If flows show "disconnected":**
1. Click Deploy button again
2. Check internet connection (HiveMQ is cloud-based)
3. Verify MQTT credentials in broker configuration

**If no data appears:**
1. Verify FactoryGuard services are running (`npm run server:all`)
2. Check that supOS sync service is active (look for log messages)
3. Click "Test MQTT Publish" in FactoryGuard dashboard

**If import fails:**
1. Use "clipboard" import instead of file import
2. Copy entire JSON file content
3. Paste into import dialog

---

## Post-Demo Actions

1. **Save screenshots** to `docs/screenshots/` folder
2. **Export flows** from NodeRED (for backup)
3. **Document any customizations** made during demo
4. **Share connection details** with supOS team
5. **Provide setup guide** (`docs/SUPOS_SETUP_GUIDE.md`)
