# FactoryGuard AI - supOS CE Integration Demo Video Script

## Video Structure
- **Duration**: 5-7 minutes
- **Format**: Screen recording with voiceover
- **Tools**: OBS Studio or similar screen recording software

## Opening Scene (30 seconds)
*[Show FactoryGuard AI logo and supOS CE logo side by side]*

**Voiceover:**
"Hello judges! Welcome to our FactoryGuard AI demonstration. Today, I'll show you how we've successfully integrated FactoryGuard AI with supOS CE - the Community Edition of the industrial IoT platform. This integration enables real-time equipment monitoring and predictive maintenance for manufacturing facilities."

## Section 1: System Architecture Overview (1 minute)
*[Show system architecture diagram from technical presentation]*

**Voiceover:**
"Let's start with the system architecture. Our integration consists of:

1. **supOS CE Platform** - Running EMQX MQTT broker, Node-RED, and Grafana
2. **FactoryGuard AI** - Our Next.js application with MQTT listener and AI prediction engine
3. **Data Flow** - Real-time sensor data flows from supOS CE to FactoryGuard via MQTT protocol

The communication uses the Unified Namespace (UNS) standard with topics like: factory/workshopA/productionLine1/cnc_machine_001/sensors/temperature"

## Section 2: supOS CE Setup Demonstration (1 minute)
*[Show terminal/command prompt with supOS CE services]*

**Voiceover:**
"First, let's verify that supOS CE is running properly. As you can see, we have the EMQX MQTT broker running on port 1883, Node-RED on port 1880, and Grafana on port 3001. The MQTT broker is configured with authentication - username 'supos' and password 'supos'."

*[Show docker ps output showing running containers]*

## Section 3: MQTT Data Publishing (1 minute)
*[Show Node-RED flow or MQTT publisher script]*

**Voiceover:**
"Now let's see how sensor data is published from supOS CE. In a real industrial setup, this would come from PLCs, sensors, and IoT devices connected through Node-RED. For our demo, we have a test publisher that simulates realistic CNC machine sensor data."

*[Show the test-mqtt.js script running]*

**Voiceover:**
"As you can see, our publisher is sending data for CNC Machine 001 with multiple sensor types: temperature, vibration, pressure, energy consumption, RPM, and load percentage. Notice the source field shows 'supos_nodered' - indicating this data originates from supOS CE's Node-RED."

## Section 4: FactoryGuard AI Data Reception (1 minute)
*[Switch to FactoryGuard AI terminal showing MQTT listener output]*

**Voiceover:**
"Now let's see how FactoryGuard AI receives and processes this data. Our MQTT listener is connected to the supOS CE broker and subscribing to all sensor topics."

*[Show the incoming MQTT messages being processed]*

**Voiceover:**
"Perfect! FactoryGuard is receiving the data in real-time. You can see it's processing temperature readings of 77.6°C, vibration at 5.6 mm/s, and other sensor values. The system validates the data, stores it in Supabase database, and broadcasts it to connected clients via WebSocket."

## Section 5: Real-time Dashboard (1 minute)
*[Show FactoryGuard AI web interface with live data]*

**Voiceover:**
"Let's now look at the FactoryGuard AI dashboard where operators can monitor equipment in real-time. The dashboard shows live sensor readings, equipment status, and health scores."

*[Navigate through dashboard showing different views]*

**Voiceover:**
"As you can see, CNC Machine 001 is currently running with a health score of 87.6%. The dashboard updates in real-time as new sensor data arrives from supOS CE. The system also performs AI-powered anomaly detection to identify potential equipment issues before they cause downtime."

## Section 6: Data Flow Verification (1 minute)
*[Show MQTT monitoring tool or logs proving data flow]*

**Voiceover:**
"To prove the complete integration, let's verify the data flow from supOS CE to FactoryGuard AI. Here you can see the MQTT messages being published by supOS CE and received by our FactoryGuard system."

*[Show mosquitto_sub output or similar MQTT monitoring]*

**Voiceover:**
"The data flows seamlessly: supOS CE publishes → MQTT broker receives → FactoryGuard subscribes → Data processed → Dashboard updates. This demonstrates a fully functional industrial IoT integration."

## Section 7: Technical Implementation Details (30 seconds)
*[Show code snippets from the integration]*

**Voiceover:**
"From a technical perspective, our integration uses:
- MQTT protocol with QoS Level 1 for reliable delivery
- UNS (Unified Namespace) for standardized topic naming
- Real-time WebSocket broadcasting for live dashboards
- Supabase for scalable data storage
- AI-powered anomaly detection using OpenAI and HuggingFace models"

## Closing Scene (30 seconds)
*[Show final dashboard with all systems running]*

**Voiceover:**
"In conclusion, we've successfully demonstrated a complete integration between FactoryGuard AI and supOS CE. The system shows real-time data flow, live monitoring capabilities, and AI-powered predictive maintenance features. This integration enables manufacturers to monitor equipment health, prevent downtime, and optimize production efficiency.

Thank you for considering our submission for the supOS Hackathon final round!"

## Technical Notes for Recording
- Use high-quality screen recording (1080p minimum)
- Ensure all text is clearly readable
- Include system timestamps to show real-time operation
- Record audio clearly with good microphone
- Add text overlays for key technical terms
- Include background music if appropriate (keep it professional)

## Backup Demonstration Option
If live demo is not possible, show:
1. Pre-recorded terminal sessions
2. Static screenshots with annotations
3. Code walkthrough
4. Architecture diagrams with data flow animations

## Submission Package
- Video file (MP4 format)
- Technical presentation PDF
- Source code repository link
- Demo script and notes