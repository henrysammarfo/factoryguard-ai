-- FactoryGuard AI Database Schema for Supabase
-- Execute this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Equipment table
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cnc', 'press', 'conveyor', 'robot', 'furnace', 'injection_molding')),
  location TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT UNIQUE,
  installation_date DATE,
  status TEXT NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'warning', 'critical', 'offline')),
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  last_maintenance TIMESTAMP,
  next_maintenance TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sensor readings table (time-series data)
CREATE TABLE sensor_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  temperature DECIMAL(5,2), -- Celsius
  vibration DECIMAL(5,2), -- mm/s
  pressure DECIMAL(5,2), -- bar
  energy_consumption DECIMAL(8,2), -- kWh
  rpm INTEGER, -- Rotations per minute
  load_percentage DECIMAL(5,2), -- 0-100%
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create hypertable for time-series optimization (if using TimescaleDB)
-- SELECT create_hypertable('sensor_readings', 'timestamp');

-- Index for fast time-range queries
CREATE INDEX idx_sensor_readings_equipment_time ON sensor_readings(equipment_id, timestamp DESC);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);

-- Alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  type TEXT NOT NULL CHECK (type IN ('temperature', 'vibration', 'pressure', 'performance', 'anomaly')),
  message TEXT NOT NULL,
  recommended_action TEXT,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMP,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alerts_equipment ON alerts(equipment_id);
CREATE INDEX idx_alerts_severity ON alerts(severity) WHERE NOT acknowledged;
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);

-- Predictions table (AI/ML outputs)
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('rul', 'failure_risk', 'anomaly')),
  predicted_value DECIMAL(10,2),
  confidence DECIMAL(5,2) CHECK (confidence >= 0 AND confidence <= 100),
  prediction_date TIMESTAMP NOT NULL,
  model_version TEXT,
  input_features JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_predictions_equipment ON predictions(equipment_id, prediction_date DESC);

-- Maintenance logs table
CREATE TABLE maintenance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('preventive', 'corrective', 'predictive')),
  description TEXT NOT NULL,
  technician TEXT,
  duration_minutes INTEGER,
  cost DECIMAL(10,2),
  parts_replaced TEXT[],
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  scheduled_date TIMESTAMP,
  completed_date TIMESTAMP,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_maintenance_equipment ON maintenance_logs(equipment_id, scheduled_date DESC);

-- OEE metrics table (calculated periodically)
CREATE TABLE oee_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL,
  availability DECIMAL(5,2) CHECK (availability >= 0 AND availability <= 100),
  performance DECIMAL(5,2) CHECK (performance >= 0 AND performance <= 100),
  quality DECIMAL(5,2) CHECK (quality >= 0 AND quality <= 100),
  oee DECIMAL(5,2) CHECK (oee >= 0 AND oee <= 100),
  planned_production_time INTEGER, -- minutes
  actual_production_time INTEGER, -- minutes
  downtime_minutes INTEGER,
  ideal_cycle_time INTEGER, -- seconds
  total_pieces INTEGER,
  good_pieces INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_oee_equipment_time ON oee_metrics(equipment_id, timestamp DESC);

-- Downtime events table
CREATE TABLE downtime_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration_minutes INTEGER,
  reason TEXT NOT NULL CHECK (reason IN ('breakdown', 'changeover', 'maintenance', 'no_operator', 'no_material', 'quality_issue')),
  category TEXT CHECK (category IN ('planned', 'unplanned')),
  description TEXT,
  cost_impact DECIMAL(10,2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_downtime_equipment ON downtime_events(equipment_id, start_time DESC);

-- User settings table (for dashboard customization)
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  alert_thresholds JSONB DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{}',
  dashboard_layout JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Functions and triggers

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate OEE automatically
CREATE OR REPLACE FUNCTION calculate_oee(
  p_availability DECIMAL,
  p_performance DECIMAL,
  p_quality DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN (p_availability * p_performance * p_quality) / 10000;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Real-time subscriptions (Supabase Realtime)
ALTER PUBLICATION supabase_realtime ADD TABLE sensor_readings;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE equipment;

-- Row Level Security (RLS) policies
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE oee_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE downtime_events ENABLE ROW LEVEL SECURITY;

-- Allow all operations for service role (backend)
CREATE POLICY "Service role has full access" ON equipment FOR ALL USING (true);
CREATE POLICY "Service role has full access" ON sensor_readings FOR ALL USING (true);
CREATE POLICY "Service role has full access" ON alerts FOR ALL USING (true);
CREATE POLICY "Service role has full access" ON predictions FOR ALL USING (true);
CREATE POLICY "Service role has full access" ON maintenance_logs FOR ALL USING (true);
CREATE POLICY "Service role has full access" ON oee_metrics FOR ALL USING (true);
CREATE POLICY "Service role has full access" ON downtime_events FOR ALL USING (true);

-- Views for common queries

-- Equipment health summary
CREATE VIEW equipment_health_summary AS
SELECT
  e.id,
  e.name,
  e.type,
  e.status,
  e.health_score,
  COUNT(DISTINCT a.id) FILTER (WHERE NOT a.acknowledged) as active_alerts,
  MAX(sr.timestamp) as last_reading,
  AVG(sr.temperature) as avg_temperature,
  AVG(sr.vibration) as avg_vibration,
  AVG(sr.energy_consumption) as avg_energy
FROM equipment e
LEFT JOIN alerts a ON e.id = a.equipment_id
LEFT JOIN sensor_readings sr ON e.id = sr.equipment_id
  AND sr.timestamp > NOW() - INTERVAL '1 hour'
GROUP BY e.id, e.name, e.type, e.status, e.health_score;

-- Recent alerts summary
CREATE VIEW recent_alerts_summary AS
SELECT
  a.*,
  e.name as equipment_name,
  e.type as equipment_type,
  e.location as equipment_location
FROM alerts a
JOIN equipment e ON a.equipment_id = e.id
WHERE a.created_at > NOW() - INTERVAL '24 hours'
ORDER BY a.created_at DESC;