const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mqtt = require('mqtt');
const { createClient } = require('@supabase/supabase-js');

class FactoryGuardPlugin {
  constructor(config) {
    this.config = config;
    this.app = null;
    this.server = null;
    this.io = null;
    this.mqttClient = null;
    this.supabase = null;
  }

  async init() {
    console.log('[FactoryGuard Plugin] Initializing...');

    // Initialize Supabase
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Initialize Express app
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server);

    // Initialize MQTT
    this.mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL);

    this.setupRoutes();
    this.setupWebSocket();
    this.setupMQTT();

    return this;
  }

  setupRoutes() {
    this.app.use(express.json());

    // API routes
    this.app.get('/api/status', (req, res) => {
      res.json({
        status: 'running',
        plugin: 'factoryguard-ai',
        version: '0.1.0'
      });
    });

    this.app.get('/api/equipment', async (req, res) => {
      try {
        const { data, error } = await this.supabase
          .from('equipment')
          .select('*');

        if (error) throw error;
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/sensor-readings', async (req, res) => {
      try {
        const { data, error } = await this.supabase
          .from('sensor_readings')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(100);

        if (error) throw error;
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  setupWebSocket() {
    this.io.on('connection', (socket) => {
      console.log('[FactoryGuard Plugin] WebSocket client connected');

      socket.on('disconnect', () => {
        console.log('[FactoryGuard Plugin] WebSocket client disconnected');
      });
    });
  }

  setupMQTT() {
    this.mqttClient.on('connect', () => {
      console.log('[FactoryGuard Plugin] MQTT connected');

      // Subscribe to UNS topics
      this.mqttClient.subscribe('factory/#', (err) => {
        if (!err) {
          console.log('[FactoryGuard Plugin] Subscribed to factory topics');
        }
      });
    });

    this.mqttClient.on('message', async (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(`[FactoryGuard Plugin] Received: ${topic}`);

        // Store sensor data
        if (topic.includes('sensors')) {
          await this.supabase.from('sensor_readings').insert(data);
        }

        // Broadcast to WebSocket clients
        this.io.emit('sensor-data', { topic, data });

      } catch (error) {
        console.error('[FactoryGuard Plugin] MQTT message error:', error);
      }
    });
  }

  async start(port = 3000) {
    return new Promise((resolve) => {
      this.server.listen(port, () => {
        console.log(`[FactoryGuard Plugin] Server running on port ${port}`);
        resolve();
      });
    });
  }

  async stop() {
    if (this.mqttClient) {
      this.mqttClient.end();
    }
    if (this.server) {
      this.server.close();
    }
    console.log('[FactoryGuard Plugin] Stopped');
  }
}

// Export for supOS plugin system
module.exports = {
  name: 'factoryguard-ai',
  version: '0.1.0',
  description: 'AI-powered predictive maintenance for industrial equipment',

  init: async function(config) {
    const plugin = new FactoryGuardPlugin(config);
    await plugin.init();
    return plugin;
  },

  routes: [
    {
      path: '/factoryguard',
      method: 'GET',
      handler: (req, res) => {
        res.send(`
          <html>
            <head><title>FactoryGuard AI</title></head>
            <body>
              <h1>FactoryGuard AI Plugin</h1>
              <p>AI-powered predictive maintenance is running within supOS.</p>
              <ul>
                <li><a href="/factoryguard/api/status">API Status</a></li>
                <li><a href="/factoryguard/api/equipment">Equipment List</a></li>
                <li><a href="/factoryguard/api/sensor-readings">Sensor Readings</a></li>
              </ul>
            </body>
          </html>
        `);
      }
    }
  ]
};