# 📊 FactoryGuard AI - supOS-CE Demo Materials

## 🎯 Demo Submission Package

### Required Files for Judges
1. **Demo Video:** `factoryguard-demo.mp4` (see script in TECHNICAL_PRESENTATION.md)
2. **Demo Setup Guide:** `DEMO_SETUP_README.md`
3. **Technical Presentation:** `docs/TECHNICAL_PRESENTATION.md`
4. **Integration Proof:** `SUPOS_INTEGRATION_PROOF.md`
5. **Source Code:** Complete repository
6. **Architecture Diagrams:** See below

---

## 🏗️ System Architecture Diagrams

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    supOS-CE Stack                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Source     │    │  Namespace  │    │    Sink     │     │
│  │   Flow      │    │    (UNS)    │    │             │     │
│  │ (Node-RED)  │───►│  (MQTT)     │───►│ TimescaleDB │     │
│  │             │    │             │    │ PostgreSQL  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 FactoryGuard AI                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ MQTT Client │    │ AI Engine   │    │ Web Dashboard│     │
│  │ (UNS Sub)   │◄──►│ Predictions │───►│ Real-time UI │     │
│  │             │    │             │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    Grafana Integration
```

### Data Flow Diagram
```
Industrial Sensors
        │
        ▼
Node-RED Flows (Source Flow)
        │
        ▼
MQTT UNS Topics
factory/workshopA/line1/cnc1/temperature
factory/workshopA/line1/cnc1/vibration
factory/workshopA/line1/cnc1/power
        │
        ▼
FactoryGuard AI (MQTT Subscriber)
        │
        ▼
AI Processing & Predictions
        │
        ▼
Alert Publishing (MQTT Publisher)
factory/alerts/cnc1/failure_prediction
        │
        ▼
Grafana Dashboard (Embedded Views)
```

---

## 📈 Mock Screenshots (Text-Based)

### FactoryGuard Dashboard Mockup
```
╔══════════════════════════════════════════════════════════════════════════════╗
║                           FactoryGuard AI - Predictive Maintenance         ║
║                                                                            ║
║  supOS-CE Status: ✅ Connected                    Last Update: 2024-01-15 14:30:25 ║
║                                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────────┐ ║
║  │ EQUIPMENT MONITORING                                                   │ ║
║  ├─────────────────────────────────────────────────────────────────────────┤ ║
║  │ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ ║
║  │ │ CNC Machine │  │ Conveyor   │  │ Robot Arm  │  │ Press      │     │ ║
║  │ │ Workshop A  │  │ Line 1     │  │ Line 2     │  │ Line 3     │     │ ║
║  │ │             │  │             │  │             │  │             │     │ ║
║  │ │ Status: 🟢  │  │ Status: 🟡  │  │ Status: 🟢  │  │ Status: 🔴  │     │ ║
║  │ │ Temp: 45°C  │  │ Speed: 2.1 │  │ Position:  │  │ Pressure:  │     │ ║
║  │ │ Vib: 0.02mm │  │ m/s        │  │ 127.5°     │  │ 1850 PSI   │     │ ║
║  │ │ Power: 85%  │  │ Load: 78%  │  │ Torque: 95 │  │ Force: 98% │     │ ║
║  │ │             │  │             │  │ Nm         │  │            │     │ ║
║  │ │ OEE: 92%    │  │ OEE: 87%    │  │ OEE: 94%    │  │ OEE: 76%    │     │ ║
║  │ └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │ ║
║  └─────────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────────┐ ║
║  │ ACTIVE ALERTS                                                          │ ║
║  ├─────────────────────────────────────────────────────────────────────────┤ ║
║  │ ⚠️  High vibration detected on CNC Machine (Workshop A)                │ ║
║  │    Failure probability: 78% in next 24 hours                           │ ║
║  │    Recommended: Schedule maintenance within 8 hours                    │ ║
║  │                                                                        │ ║
║  │ 🚨 Pressure anomaly on Press (Line 3)                                   │ ║
║  │    Current: 1850 PSI (Normal: 1600-1800 PSI)                           │ ║
║  │    AI Prediction: Check hydraulic system                                │ ║
║  └─────────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────────┐ ║
║  │ ANALYTICS                                                              │ ║
║  ├─────────────────────────────────────────────────────────────────────────┤ ║
║  │ OEE Trend: ████████▁▁ 87% (Last 24h)                                   │ ║
║  │ Energy Usage: ██████████ 94% efficiency                                │ ║
║  │ Predictive Alerts: 3 active, 12 resolved this week                    │ ║
║  └─────────────────────────────────────────────────────────────────────────┘ ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### supOS-CE Integration Status Mockup
```
╔══════════════════════════════════════════════════════════════════════════════╗
║                     supOS-CE Integration Dashboard                        ║
║                                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────────┐ ║
║  │ CONNECTION STATUS                                                      │ ║
║  ├─────────────────────────────────────────────────────────────────────────┤ ║
║  │ supOS-CE MQTT:      ✅ Connected                                       │ ║
║  │ UNS Topics:         ✅ Subscribed (12 topics)                          │ ║
║  │ Data Flow:          ✅ Active (245 msg/min)                            │ ║
║  │ Last Message:       2024-01-15 14:30:22                                │ ║
║  └─────────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────────┐ ║
║  │ UNS TOPICS SUBSCRIBED                                                  │ ║
║  ├─────────────────────────────────────────────────────────────────────────┤ ║
║  │ ✅ factory/+/equipment/+                                               │ ║
║  │ ✅ factory/+/sensors/+                                                 │ ║
║  │ ✅ factory/+/alerts/+                                                  │ ║
║  │ ✅ factory/+/maintenance/+                                             │ ║
║  └─────────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────────┐ ║
║  │ RECENT UNS MESSAGES                                                    │ ║
║  ├─────────────────────────────────────────────────────────────────────────┤ ║
║  │ 14:30:22 factory/workshopA/line1/cnc1 temp=45.2,vib=0.023              │ ║
║  │ 14:30:21 factory/workshopA/line1/conveyor1 speed=2.1,load=78           │ ║
║  │ 14:30:20 factory/workshopA/line2/robot1 pos=127.5,torque=95            │ ║
║  │ 14:30:19 factory/workshopA/line3/press pressure=1850,force=98          │ ║
║  └─────────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────────┐ ║
║  │ PUBLISHED ALERTS                                                       │ ║
║  ├─────────────────────────────────────────────────────────────────────────┤ ║
║  │ 14:29:45 → factory/alerts/cnc1/high_vibration                          │ ║
║  │ 14:28:12 → factory/alerts/press/pressure_anomaly                       │ ║
║  │ 14:25:33 → factory/predictions/cnc1/failure_24h                        │ ║
║  └─────────────────────────────────────────────────────────────────────────┘ ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 📋 Demo Validation Checklist

### Pre-Demo Setup
- [ ] supOS-CE installed and running
- [ ] Node-RED demo flows deployed
- [ ] FactoryGuard AI application running
- [ ] MQTT connection established
- [ ] Grafana integration configured

### Demo Execution
- [ ] Show supOS-CE services running
- [ ] Demonstrate UNS topic subscription
- [ ] Display real-time data flow
- [ ] Show AI predictions in action
- [ ] Demonstrate alert publishing
- [ ] Show Grafana embedded views

### Technical Validation
- [ ] MQTT broker connectivity confirmed
- [ ] UNS topic structure follows ISA-95
- [ ] Real-time data processing working
- [ ] AI models generating predictions
- [ ] Bidirectional MQTT communication
- [ ] Grafana integration functional

---

## 🎬 Demo Video Outline

### Video Specifications
- **Duration:** 12-15 minutes
- **Resolution:** 1920x1080 (Full HD)
- **Format:** MP4
- **Audio:** Clear narration with system audio

### Video Structure
1. **Introduction** (0:00-0:30) - Project overview
2. **supOS-CE Setup** (0:30-2:00) - Installation and configuration
3. **UNS Configuration** (2:00-3:30) - Data model setup
4. **FactoryGuard Integration** (3:30-5:00) - Connection establishment
5. **Live Dashboard** (5:00-7:00) - Real-time monitoring
6. **AI Predictions** (7:00-9:00) - Predictive analytics
7. **Grafana Integration** (9:00-10:30) - Unified interface
8. **Alert Management** (10:30-12:00) - Notification system
9. **Conclusion** (12:00-12:30) - Summary and benefits

### Key Demo Moments
- MQTT connection logs
- Real-time data streaming
- AI prediction generation
- Alert publishing
- Grafana dashboard integration

---

## 📞 Contact Information

**Team:** FactoryGuard AI
**Email:** [Your contact email]
**Repository:** https://github.com/henrysammarfo/factoryguard-ai
**supOS-CE:** https://github.com/FREEZONEX/supOS-CE

**Demo Requirements:**
- Docker environment for supOS-CE
- Node.js for FactoryGuard AI
- 15 minutes setup time
- Stable network connection

---

*This demo package provides comprehensive evidence of FactoryGuard AI's real integration with supOS Community Edition, demonstrating production-ready industrial IoT capabilities with AI-powered predictive maintenance.*