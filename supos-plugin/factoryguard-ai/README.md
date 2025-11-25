# FactoryGuard AI - supOS Plugin

AI-powered predictive maintenance for industrial equipment monitoring, integrated as a native supOS plugin.

## Features

- **Real-time Equipment Monitoring**: Track temperature, vibration, and pressure sensors
- **AI-Powered Predictions**: Machine learning models for failure prediction
- **Automated Alerts**: Intelligent alert generation based on sensor thresholds
- **UNS Integration**: Full Unified Namespace support for industrial data
- **WebSocket Streaming**: Real-time data updates to connected clients
- **MQTT Connectivity**: Industrial protocol support for sensor data ingestion

## Installation

1. Login to your supOS instance
2. Navigate to **Plugin Management**
3. Click **Upload Plugin**
4. Select the `factoryguard-ai-plugin.zip` file
5. Configure environment variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Supabase anonymous key
   - `MQTT_BROKER_URL`: MQTT broker connection string
   - `HUGGINGFACE_API_KEY`: Hugging Face API key for AI models

## Usage

Once installed, FactoryGuard AI will be available in your supOS interface:

- **App Space**: Access the full FactoryGuard dashboard
- **UNS**: Monitor factory namespace topics
- **Source Flow**: View MQTT data ingestion
- **Event Flow**: See AI processing rules
- **Dashboards**: Custom widgets for equipment monitoring

## API Endpoints

- `GET /factoryguard/api/status` - Plugin status
- `GET /factoryguard/api/equipment` - Equipment list
- `GET /factoryguard/api/sensor-readings` - Recent sensor data

## UNS Topics

The plugin subscribes to and publishes on these topics:

**Subscriptions:**
- `factory/+/+/+/equipment/+` - Equipment status updates
- `factory/+/+/+/sensors/+` - Sensor readings
- `factory/+/alerts/+` - Alert notifications

**Publications:**
- `factory/equipment/status` - Equipment health data
- `factory/predictions/failure` - AI failure predictions

## Configuration

Environment variables required:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
MQTT_BROKER_URL=mqtt://broker.example.com:1883
HUGGINGFACE_API_KEY=your-huggingface-key
```

## Support

For issues or questions, please check the supOS documentation or contact the FactoryGuard team.