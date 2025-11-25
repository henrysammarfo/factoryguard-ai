-- FactoryGuard AI Demo Data Seed
-- Execute this after schema.sql in Supabase SQL Editor

-- Insert demo equipment
INSERT INTO equipment (id, name, type, location, manufacturer, model, serial_number, installation_date, status, health_score, last_maintenance, next_maintenance, metadata) VALUES
(gen_random_uuid(), 'CNC Milling Machine #1', 'cnc', 'Production Floor A', 'Haas Automation', 'VF-2SS', 'HAAS-2024-001', '2023-01-15', 'operational', 92, '2024-09-15', '2024-12-15', '{"capacity": "2000 rpm", "power": "30 kW"}'),
(gen_random_uuid(), 'Hydraulic Press #2', 'press', 'Production Floor A', 'Schuler', 'HP-500', 'SCH-2023-045', '2022-06-20', 'warning', 78, '2024-08-20', '2024-11-20', '{"capacity": "500 tons", "power": "45 kW"}'),
(gen_random_uuid(), 'Conveyor Belt System', 'conveyor', 'Production Floor B', 'Siemens', 'CB-1000', 'SIEM-2023-089', '2023-03-10', 'operational', 95, '2024-10-01', '2025-01-01', '{"length": "50m", "speed": "2 m/s"}'),
(gen_random_uuid(), 'Robotic Assembly Arm', 'robot', 'Assembly Line 1', 'Fanuc', 'M-710iC', 'FANUC-2024-112', '2024-02-28', 'operational', 98, '2024-09-28', '2024-12-28', '{"reach": "2.1m", "payload": "35kg"}'),
(gen_random_uuid(), 'Industrial Furnace', 'furnace', 'Heat Treatment Bay', 'Ipsen', 'VFC-1000', 'IPSEN-2022-067', '2022-11-15', 'critical', 45, '2024-07-15', '2024-10-15', '{"max_temp": "1200°C", "power": "150 kW"}'),
(gen_random_uuid(), 'Injection Molding Machine', 'injection_molding', 'Molding Area', 'Arburg', 'Allrounder 570 H', 'ARBURG-2023-134', '2023-08-22', 'operational', 87, '2024-08-22', '2024-11-22', '{"clamping_force": "570 tons", "power": "55 kW"}');

-- Insert sample sensor readings (last 24 hours)
INSERT INTO sensor_readings (equipment_id, timestamp, temperature, vibration, pressure, energy_consumption, rpm, load_percentage) VALUES
-- CNC Mill readings
((SELECT id FROM equipment WHERE name = 'CNC Milling Machine #1' LIMIT 1), NOW() - INTERVAL '1 hour', 67.5, 2.1, NULL, 24.5, 1800, 85.0),
((SELECT id FROM equipment WHERE name = 'CNC Milling Machine #1' LIMIT 1), NOW() - INTERVAL '30 minutes', 68.2, 2.3, NULL, 25.1, 1850, 88.0),
((SELECT id FROM equipment WHERE name = 'CNC Milling Machine #1' LIMIT 1), NOW() - INTERVAL '1 minute', 66.8, 2.0, NULL, 23.8, 1750, 82.0),

-- Hydraulic Press readings
((SELECT id FROM equipment WHERE name = 'Hydraulic Press #2' LIMIT 1), NOW() - INTERVAL '2 hours', 78.5, 4.2, 85.5, 42.1, NULL, 92.0),
((SELECT id FROM equipment WHERE name = 'Hydraulic Press #2' LIMIT 1), NOW() - INTERVAL '1 hour', 82.1, 5.8, 87.2, 44.5, NULL, 95.0),
((SELECT id FROM equipment WHERE name = 'Hydraulic Press #2' LIMIT 1), NOW() - INTERVAL '30 minutes', 85.3, 6.2, 89.1, 46.8, NULL, 98.0),

-- Conveyor Belt readings
((SELECT id FROM equipment WHERE name = 'Conveyor Belt System' LIMIT 1), NOW() - INTERVAL '45 minutes', 45.2, 1.8, NULL, 12.5, NULL, 78.0),
((SELECT id FROM equipment WHERE name = 'Conveyor Belt System' LIMIT 1), NOW() - INTERVAL '15 minutes', 46.1, 1.9, NULL, 13.2, NULL, 82.0),

-- Robotic Arm readings
((SELECT id FROM equipment WHERE name = 'Robotic Assembly Arm' LIMIT 1), NOW() - INTERVAL '1 hour', 52.3, 1.2, NULL, 8.9, NULL, 65.0),
((SELECT id FROM equipment WHERE name = 'Robotic Assembly Arm' LIMIT 1), NOW() - INTERVAL '30 minutes', 51.8, 1.1, NULL, 8.5, NULL, 68.0),

-- Furnace readings (critical) - Fixed temperature values
((SELECT id FROM equipment WHERE name = 'Industrial Furnace' LIMIT 1), NOW() - INTERVAL '3 hours', 150.0, 8.5, NULL, 145.2, NULL, 95.0),
((SELECT id FROM equipment WHERE name = 'Industrial Furnace' LIMIT 1), NOW() - INTERVAL '2 hours', 180.0, 9.2, NULL, 148.5, NULL, 98.0),
((SELECT id FROM equipment WHERE name = 'Industrial Furnace' LIMIT 1), NOW() - INTERVAL '1 hour', 220.0, 10.1, NULL, 152.1, NULL, 100.0),

-- Injection Molding readings
((SELECT id FROM equipment WHERE name = 'Injection Molding Machine' LIMIT 1), NOW() - INTERVAL '2 hours', 245.0, 3.5, 120.5, 52.1, NULL, 88.0),
((SELECT id FROM equipment WHERE name = 'Injection Molding Machine' LIMIT 1), NOW() - INTERVAL '1 hour', 248.0, 3.8, 122.1, 53.5, NULL, 91.0);

-- Insert sample alerts
INSERT INTO alerts (equipment_id, severity, type, message, recommended_action, acknowledged, metadata) VALUES
((SELECT id FROM equipment WHERE name = 'Hydraulic Press #2' LIMIT 1), 'warning', 'temperature', 'Temperature approaching upper threshold: 85.3°C', 'Monitor closely and schedule inspection within 24 hours', false, '{"current_value": 85.3, "threshold": 80.0}'),
((SELECT id FROM equipment WHERE name = 'Hydraulic Press #2' LIMIT 1), 'warning', 'vibration', 'Excessive vibration detected: 6.2 mm/s', 'Inspect bearings and alignment within 48 hours', false, '{"current_value": 6.2, "threshold": 5.0}'),
((SELECT id FROM equipment WHERE name = 'Industrial Furnace' LIMIT 1), 'critical', 'temperature', 'Critical temperature spike: 220°C', 'Emergency shutdown and immediate inspection required', false, '{"current_value": 220.0, "threshold": 150.0}'),
((SELECT id FROM equipment WHERE name = 'Industrial Furnace' LIMIT 1), 'critical', 'vibration', 'Dangerous vibration levels: 10.1 mm/s', 'Stop operation and perform structural inspection', false, '{"current_value": 10.1, "threshold": 8.0}'),
((SELECT id FROM equipment WHERE name = 'CNC Milling Machine #1' LIMIT 1), 'info', 'performance', 'Energy consumption above normal range', 'Review cutting parameters and tool wear', false, '{"current_value": 25.1, "normal_range": "20-24"}');

-- Insert sample predictions
INSERT INTO predictions (equipment_id, prediction_type, predicted_value, confidence, prediction_date, model_version, input_features) VALUES
((SELECT id FROM equipment WHERE name = 'CNC Milling Machine #1' LIMIT 1), 'rul', 245.0, 87.5, NOW() + INTERVAL '30 days', 'timeseries-transformer-v1', '{"data_points": 100, "time_range": "7 days"}'),
((SELECT id FROM equipment WHERE name = 'Hydraulic Press #2' LIMIT 1), 'failure_risk', 78.0, 82.1, NOW() + INTERVAL '15 days', 'anomaly-detection-v1', '{"anomalies_detected": 3, "trend": "increasing"}'),
((SELECT id FROM equipment WHERE name = 'Industrial Furnace' LIMIT 1), 'rul', 45.0, 91.2, NOW() + INTERVAL '7 days', 'timeseries-transformer-v1', '{"critical_anomalies": 5, "degradation_rate": "high"}'),
((SELECT id FROM equipment WHERE name = 'Robotic Assembly Arm' LIMIT 1), 'rul', 380.0, 94.5, NOW() + INTERVAL '60 days', 'timeseries-transformer-v1', '{"maintenance_history": "good", "usage_pattern": "normal"}');

-- Insert sample maintenance logs
INSERT INTO maintenance_logs (equipment_id, maintenance_type, description, technician, duration_minutes, cost, parts_replaced, status, scheduled_date, completed_date, notes) VALUES
((SELECT id FROM equipment WHERE name = 'CNC Milling Machine #1' LIMIT 1), 'preventive', 'Monthly spindle lubrication and bearing inspection', 'Mike Johnson', 45, 125.00, ARRAY['spindle oil', 'bearing grease'], 'completed', '2024-09-15', '2024-09-15', 'All bearings within tolerance, spindle runout 0.002mm'),
((SELECT id FROM equipment WHERE name = 'Hydraulic Press #2' LIMIT 1), 'corrective', 'Hydraulic leak repair and pressure testing', 'Sarah Chen', 120, 450.00, ARRAY['hydraulic hose', 'pressure gauge'], 'completed', '2024-08-20', '2024-08-20', 'Replaced leaking hose, pressure now stable at 87 bar'),
((SELECT id FROM equipment WHERE name = 'Industrial Furnace' LIMIT 1), 'predictive', 'Emergency thermocouple replacement', 'David Wilson', 180, 890.00, ARRAY['thermocouple assembly', 'thermal insulation'], 'scheduled', '2024-10-15', NULL, 'Critical temperature readings unreliable');

-- Insert sample OEE metrics
INSERT INTO oee_metrics (equipment_id, timestamp, availability, performance, quality, oee, planned_production_time, actual_production_time, downtime_minutes, ideal_cycle_time, total_pieces, good_pieces) VALUES
((SELECT id FROM equipment WHERE name = 'CNC Milling Machine #1' LIMIT 1), NOW() - INTERVAL '1 day', 95.2, 87.5, 98.1, 81.8, 480, 456, 24, 45, 608, 596),
((SELECT id FROM equipment WHERE name = 'CNC Milling Machine #1' LIMIT 1), NOW() - INTERVAL '2 days', 97.8, 89.2, 97.5, 85.1, 480, 469, 11, 45, 626, 610),
((SELECT id FROM equipment WHERE name = 'Hydraulic Press #2' LIMIT 1), NOW() - INTERVAL '1 day', 92.1, 84.3, 96.8, 75.4, 480, 442, 38, 120, 221, 214),
((SELECT id FROM equipment WHERE name = 'Conveyor Belt System' LIMIT 1), NOW() - INTERVAL '1 day', 99.5, 95.1, 99.8, 94.4, 480, 478, 2, NULL, NULL, NULL),
((SELECT id FROM equipment WHERE name = 'Robotic Assembly Arm' LIMIT 1), NOW() - INTERVAL '1 day', 96.8, 91.2, 99.2, 87.5, 480, 465, 15, 25, 1116, 1107),
((SELECT id FROM equipment WHERE name = 'Industrial Furnace' LIMIT 1), NOW() - INTERVAL '1 day', 85.3, 78.9, 94.1, 63.1, 480, 408, 72, 180, 136, 128),
((SELECT id FROM equipment WHERE name = 'Injection Molding Machine' LIMIT 1), NOW() - INTERVAL '1 day', 93.7, 86.4, 97.3, 78.2, 480, 450, 30, 35, 771, 750);

-- Insert sample downtime events
INSERT INTO downtime_events (equipment_id, start_time, end_time, duration_minutes, reason, category, description, cost_impact) VALUES
((SELECT id FROM equipment WHERE name = 'Industrial Furnace' LIMIT 1), NOW() - INTERVAL '2 hours', NOW() - INTERVAL '30 minutes', 90, 'breakdown', 'unplanned', 'Thermocouple failure causing temperature control issues', 2250.00),
((SELECT id FROM equipment WHERE name = 'Hydraulic Press #2' LIMIT 1), NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours', 60, 'maintenance', 'planned', 'Scheduled hydraulic system inspection', 150.00),
((SELECT id FROM equipment WHERE name = 'CNC Milling Machine #1' LIMIT 1), NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours 45 minutes', 15, 'changeover', 'planned', 'Tool change for different part production', 37.50);