# 🎬 FactoryGuard AI - supOS Hackathon Demo Video Script

## 📋 **Video Overview**
**Duration:** 5-7 minutes
**Target:** supOS Hackathon Judges
**Focus:** Demonstrate clear supOS integration and industrial IoT capabilities

---

## 🎯 **Demo Structure**

### **1. Introduction (30 seconds)**
- **Title Card:** "FactoryGuard AI - supOS Hackathon Submission"
- **Narrator:** "Hello judges! I'm demonstrating FactoryGuard AI, a predictive maintenance platform with full supOS CE integration for industrial IoT applications."
- **Show:** Live application running at `http://localhost:3000`

### **2. supOS Platform Setup (1 minute)**
- **Show supOS CE running locally**
  - Docker containers running (supOS CE, MQTT Broker, Node-RED, Grafana)
  - MQTT broker on port 1883
  - supOS CE web interface
- **Narrator:** "First, I have supOS CE Community Edition running locally with MQTT broker, Node-RED, and Grafana - the complete industrial IoT stack."

### **3. FactoryGuard AI Overview (45 seconds)**
- **Navigate through the application:**
  - Dashboard with real-time equipment monitoring
  - Analytics page with AI predictions
  - Monitoring page with live sensor data
- **Narrator:** "FactoryGuard AI provides comprehensive equipment monitoring with AI-powered predictive maintenance."

### **4. supOS Integration Demonstration (2 minutes) - MOST IMPORTANT**
- **Show MQTT Data Flow:**
  - Open terminal showing MQTT messages: `node test-supos-data.js`
  - Show live data publishing every 3 seconds
  - Display MQTT topics: `factory/workshopA/productionLine1/cnc_machine_001/sensors/*`

- **Show FactoryGuard Receiving Data:**
  - Open server terminal showing: `[FactoryGuard] 📥 Received supOS CE temperature data`
  - Show real-time data updates in the UI
  - Demonstrate WebSocket updates

- **Show UNS (Unified Namespace) Topics:**
  - Explain ISA-95 compliant topic hierarchy
  - Show equipment status topics
  - Show sensor data topics

- **Narrator:** "Now for the core supOS integration. Watch as real sensor data flows from supOS CE through MQTT broker to FactoryGuard AI using the Unified Namespace (UNS) standard. Every 3 seconds, temperature, vibration, pressure, energy, RPM, and load data is published to structured MQTT topics following ISA-95 standards."

### **5. AI Predictive Analytics (1 minute)**
- **Show AI predictions in Analytics page**
  - RUL (Remaining Useful Life) predictions
  - Anomaly detection with confidence scores
  - Risk assessments (High/Medium/Low)
- **Narrator:** "The AI analyzes sensor patterns to predict equipment failures and detect anomalies in real-time."

### **6. Data Management & Export (45 seconds)**
- **Show Settings > Data Management**
  - Clear seed data option
  - Import real equipment data
  - Export functionality
- **Narrator:** "Users can import their actual equipment data and export analytics for integration with existing systems."

### **7. Technical Architecture (45 seconds)**
- **Show code structure:**
  - `server/supos-integration.ts` - supOS connection logic
  - `lib/supos/client.ts` - supOS API client
  - `server/mqtt-listener.ts` - MQTT data ingestion
- **Narrator:** "The architecture uses MQTT for real-time data, WebSocket for UI updates, and Supabase for data persistence."

### **8. Conclusion (30 seconds)**
- **Summary slide:** Key achievements
- **Narrator:** "FactoryGuard AI demonstrates complete supOS integration with real-time industrial IoT data flow, AI-powered predictive maintenance, and professional manufacturing dashboard capabilities."
- **Contact:** "Thank you for reviewing! Repository: https://github.com/henrysammarfo/factoryguard-ai"

---

## 🎥 **Video Production Notes**

### **Screen Recording Setup:**
- **Resolution:** 1920x1080 (Full HD)
- **Frame Rate:** 30 FPS
- **Software:** OBS Studio or similar
- **Audio:** Clear narration with background music

### **Visual Elements:**
- **Text Overlays:** Key points and MQTT topics
- **Split Screen:** Show MQTT terminal + web app simultaneously
- **Highlights:** Green boxes around important UI elements
- **Transitions:** Smooth transitions between sections

### **Key Demo Points to Emphasize:**
1. **Real MQTT Data Flow** - Show actual messages being published/received
2. **UNS Topic Structure** - Explain ISA-95 compliance
3. **Live Updates** - Show data changing in real-time
4. **supOS CE Integration** - Multiple containers running
5. **AI Functionality** - Predictions and anomaly detection
6. **Professional UI** - Production-ready interface

### **Backup Demonstrations:**
- If supOS CE isn't running: Show MQTT test script and mock data
- Show code walkthrough of integration points
- Demonstrate API endpoints working

---

## 📊 **Technical Proof Points**

### **supOS Integration Evidence:**
- ✅ MQTT broker connection (port 1883)
- ✅ UNS topic subscriptions (`factory/+/+/+/equipment/+`)
- ✅ Real-time data ingestion every 3 seconds
- ✅ Equipment status and sensor data publishing
- ✅ WebSocket broadcasting to frontend
- ✅ supOS CE dashboard integration attempt

### **Industrial IoT Features:**
- ✅ ISA-95 compliant topic hierarchy
- ✅ Multiple sensor types (temp, vibration, pressure, energy, RPM, load)
- ✅ Equipment health scoring
- ✅ Predictive maintenance AI
- ✅ Alert system with severity levels
- ✅ Data export capabilities

---

## 🎯 **Judge Evaluation Checklist**

**Did the demo clearly show:**
- [ ] supOS CE platform running
- [ ] MQTT data flow from supOS to application
- [ ] UNS (Unified Namespace) usage
- [ ] Real-time industrial data processing
- [ ] Professional manufacturing dashboard
- [ ] AI-powered predictive analytics
- [ ] Complete end-to-end integration

**Technical Excellence:**
- [ ] Clean, well-organized code
- [ ] Proper error handling
- [ ] Scalable architecture
- [ ] Industrial-grade reliability
- [ ] Comprehensive documentation

---

## 🚀 **Quick Recording Checklist**

**Before Recording:**
- [ ] supOS CE containers running (`docker ps`)
- [ ] MQTT broker accessible (`netstat -an | find "1883"`)
- [ ] FactoryGuard app running (`npm run server:all`)
- [ ] Test data publishing (`node test-supos-data.js`)
- [ ] All pages loading correctly
- [ ] Export functionality tested

**During Recording:**
- [ ] Clear audio narration
- [ ] Highlight key integration points
- [ ] Show real data flowing
- [ ] Demonstrate AI predictions
- [ ] Explain technical architecture

**After Recording:**
- [ ] Review for clarity
- [ ] Add text overlays for MQTT topics
- [ ] Ensure 5-7 minute runtime
- [ ] Export in high quality (MP4)