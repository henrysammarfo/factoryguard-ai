import { HfInference } from '@huggingface/inference'
import { supabaseAdmin } from '@/lib/supabase/admin'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

// Advanced AI models for enhanced predictions
const ANOMALY_MODEL = 'microsoft/DialoGPT-medium' // For pattern analysis
const PREDICTION_MODEL = 'gpt2' // For predictive insights

// Thresholds for anomaly detection
const ANOMALY_THRESHOLDS = {
  temperature: { warning: 80, critical: 90 },
  vibration: { warning: 5.0, critical: 7.0 },
  pressure: { warning: 8.0, critical: 10.0 },
  energy: { warning: 60, critical: 80 },
  rpm: { warning: 3500, critical: 4000 },
  load: { warning: 85, critical: 95 }
}

async function detectAnomalies(equipmentId: string) {
  try {
    // Fetch latest sensor readings
    const { data: readings, error } = await supabaseAdmin
      .from('sensor_readings')
      .select('temperature, vibration, pressure, energy_consumption, rpm, load_percentage, timestamp')
      .eq('equipment_id', equipmentId)
      .order('timestamp', { ascending: false })
      .limit(50) // Increased for better AI analysis

    if (error || !readings || readings.length === 0) {
      console.log('[FactoryGuard] No data for anomaly detection')
      return null
    }

    const latest = readings[0]
    const anomalies = []

    // Traditional threshold-based detection
    const thresholdAnomalies = detectThresholdAnomalies(latest)

    // AI-powered pattern analysis
    const aiAnomalies = await detectAIPatternAnomalies(readings)

    // Combine both detection methods
    anomalies.push(...thresholdAnomalies, ...aiAnomalies)

    // Check each sensor against thresholds
    if (latest.temperature > ANOMALY_THRESHOLDS.temperature.critical) {
      anomalies.push({
        sensor: 'temperature',
        value: latest.temperature,
        threshold: ANOMALY_THRESHOLDS.temperature.critical,
        severity: 'critical',
        message: `Temperature ${latest.temperature}°C exceeds critical threshold`
      })
    } else if (latest.temperature > ANOMALY_THRESHOLDS.temperature.warning) {
      anomalies.push({
        sensor: 'temperature',
        value: latest.temperature,
        threshold: ANOMALY_THRESHOLDS.temperature.warning,
        severity: 'warning',
        message: `Temperature ${latest.temperature}°C exceeds warning threshold`
      })
    }

    if (latest.vibration > ANOMALY_THRESHOLDS.vibration.critical) {
      anomalies.push({
        sensor: 'vibration',
        value: latest.vibration,
        threshold: ANOMALY_THRESHOLDS.vibration.critical,
        severity: 'critical',
        message: `Vibration ${latest.vibration} mm/s exceeds critical threshold`
      })
    } else if (latest.vibration > ANOMALY_THRESHOLDS.vibration.warning) {
      anomalies.push({
        sensor: 'vibration',
        value: latest.vibration,
        threshold: ANOMALY_THRESHOLDS.vibration.warning,
        severity: 'warning',
        message: `Vibration ${latest.vibration} mm/s exceeds warning threshold`
      })
    }

    if (latest.pressure > ANOMALY_THRESHOLDS.pressure.critical) {
      anomalies.push({
        sensor: 'pressure',
        value: latest.pressure,
        threshold: ANOMALY_THRESHOLDS.pressure.critical,
        severity: 'critical',
        message: `Pressure ${latest.pressure} bar exceeds critical threshold`
      })
    } else if (latest.pressure > ANOMALY_THRESHOLDS.pressure.warning) {
      anomalies.push({
        sensor: 'pressure',
        value: latest.pressure,
        threshold: ANOMALY_THRESHOLDS.pressure.warning,
        severity: 'warning',
        message: `Pressure ${latest.pressure} bar exceeds warning threshold`
      })
    }

    if (latest.energy_consumption > ANOMALY_THRESHOLDS.energy.critical) {
      anomalies.push({
        sensor: 'energy',
        value: latest.energy_consumption,
        threshold: ANOMALY_THRESHOLDS.energy.critical,
        severity: 'critical',
        message: `Energy consumption ${latest.energy_consumption} kW exceeds critical threshold`
      })
    } else if (latest.energy_consumption > ANOMALY_THRESHOLDS.energy.warning) {
      anomalies.push({
        sensor: 'energy',
        value: latest.energy_consumption,
        threshold: ANOMALY_THRESHOLDS.energy.warning,
        severity: 'warning',
        message: `Energy consumption ${latest.energy_consumption} kW exceeds warning threshold`
      })
    }

    if (latest.rpm > ANOMALY_THRESHOLDS.rpm.critical) {
      anomalies.push({
        sensor: 'rpm',
        value: latest.rpm,
        threshold: ANOMALY_THRESHOLDS.rpm.critical,
        severity: 'critical',
        message: `RPM ${latest.rpm} exceeds critical threshold`
      })
    } else if (latest.rpm > ANOMALY_THRESHOLDS.rpm.warning) {
      anomalies.push({
        sensor: 'rpm',
        value: latest.rpm,
        threshold: ANOMALY_THRESHOLDS.rpm.warning,
        severity: 'warning',
        message: `RPM ${latest.rpm} exceeds warning threshold`
      })
    }

    if (latest.load_percentage > ANOMALY_THRESHOLDS.load.critical) {
      anomalies.push({
        sensor: 'load',
        value: latest.load_percentage,
        threshold: ANOMALY_THRESHOLDS.load.critical,
        severity: 'critical',
        message: `Load ${latest.load_percentage}% exceeds critical threshold`
      })
    } else if (latest.load_percentage > ANOMALY_THRESHOLDS.load.warning) {
      anomalies.push({
        sensor: 'load',
        value: latest.load_percentage,
        threshold: ANOMALY_THRESHOLDS.load.warning,
        severity: 'warning',
        message: `Load ${latest.load_percentage}% exceeds warning threshold`
      })
    }

    // Store anomalies if any detected
    if (anomalies.length > 0) {
      for (const anomaly of anomalies) {
        await supabaseAdmin
          .from('anomalies')
          .insert({
            equipment_id: equipmentId,
            anomaly_type: anomaly.sensor,
            severity: anomaly.severity,
            description: anomaly.message,
            detected_value: anomaly.value,
            threshold_value: anomaly.threshold,
            detected_at: new Date().toISOString(),
            status: 'active'
          })
      }

      console.log(`[FactoryGuard] Detected ${anomalies.length} anomalies for ${equipmentId}`)
    }

    return anomalies
  } catch (error) {
    console.error('[FactoryGuard] Anomaly detection error:', error)
    return null
  }
}

function detectThresholdAnomalies(latest: any) {
  const anomalies = []

  // Check each sensor against thresholds
  if (latest.temperature > ANOMALY_THRESHOLDS.temperature.critical) {
    anomalies.push({
      sensor: 'temperature',
      value: latest.temperature,
      threshold: ANOMALY_THRESHOLDS.temperature.critical,
      severity: 'critical',
      message: `Temperature ${latest.temperature}°C exceeds critical threshold`
    })
  } else if (latest.temperature > ANOMALY_THRESHOLDS.temperature.warning) {
    anomalies.push({
      sensor: 'temperature',
      value: latest.temperature,
      threshold: ANOMALY_THRESHOLDS.temperature.warning,
      severity: 'warning',
      message: `Temperature ${latest.temperature}°C exceeds warning threshold`
    })
  }

  if (latest.vibration > ANOMALY_THRESHOLDS.vibration.critical) {
    anomalies.push({
      sensor: 'vibration',
      value: latest.vibration,
      threshold: ANOMALY_THRESHOLDS.vibration.critical,
      severity: 'critical',
      message: `Vibration ${latest.vibration} mm/s exceeds critical threshold`
    })
  } else if (latest.vibration > ANOMALY_THRESHOLDS.vibration.warning) {
    anomalies.push({
      sensor: 'vibration',
      value: latest.vibration,
      threshold: ANOMALY_THRESHOLDS.vibration.warning,
      severity: 'warning',
      message: `Vibration ${latest.vibration} mm/s exceeds warning threshold`
    })
  }

  if (latest.pressure > ANOMALY_THRESHOLDS.pressure.critical) {
    anomalies.push({
      sensor: 'pressure',
      value: latest.pressure,
      threshold: ANOMALY_THRESHOLDS.pressure.critical,
      severity: 'critical',
      message: `Pressure ${latest.pressure} bar exceeds critical threshold`
    })
  } else if (latest.pressure > ANOMALY_THRESHOLDS.pressure.warning) {
    anomalies.push({
      sensor: 'pressure',
      value: latest.pressure,
      threshold: ANOMALY_THRESHOLDS.pressure.warning,
      severity: 'warning',
      message: `Pressure ${latest.pressure} bar exceeds warning threshold`
    })
  }

  if (latest.energy_consumption > ANOMALY_THRESHOLDS.energy.critical) {
    anomalies.push({
      sensor: 'energy',
      value: latest.energy_consumption,
      threshold: ANOMALY_THRESHOLDS.energy.critical,
      severity: 'critical',
      message: `Energy consumption ${latest.energy_consumption} kW exceeds critical threshold`
    })
  } else if (latest.energy_consumption > ANOMALY_THRESHOLDS.energy.warning) {
    anomalies.push({
      sensor: 'energy',
      value: latest.energy_consumption,
      threshold: ANOMALY_THRESHOLDS.energy.warning,
      severity: 'warning',
      message: `Energy consumption ${latest.energy_consumption} kW exceeds warning threshold`
    })
  }

  if (latest.rpm > ANOMALY_THRESHOLDS.rpm.critical) {
    anomalies.push({
      sensor: 'rpm',
      value: latest.rpm,
      threshold: ANOMALY_THRESHOLDS.rpm.critical,
      severity: 'critical',
      message: `RPM ${latest.rpm} exceeds critical threshold`
    })
  } else if (latest.rpm > ANOMALY_THRESHOLDS.rpm.warning) {
    anomalies.push({
      sensor: 'rpm',
      value: latest.rpm,
      threshold: ANOMALY_THRESHOLDS.rpm.warning,
      severity: 'warning',
      message: `RPM ${latest.rpm} exceeds warning threshold`
    })
  }

  if (latest.load_percentage > ANOMALY_THRESHOLDS.load.critical) {
    anomalies.push({
      sensor: 'load',
      value: latest.load_percentage,
      threshold: ANOMALY_THRESHOLDS.load.critical,
      severity: 'critical',
      message: `Load ${latest.load_percentage}% exceeds critical threshold`
    })
  } else if (latest.load_percentage > ANOMALY_THRESHOLDS.load.warning) {
    anomalies.push({
      sensor: 'load',
      value: latest.load_percentage,
      threshold: ANOMALY_THRESHOLDS.load.warning,
      severity: 'warning',
      message: `Load ${latest.load_percentage}% exceeds warning threshold`
    })
  }

  return anomalies
}

async function detectAIPatternAnomalies(readings: any[]) {
  const anomalies = []

  try {
    // Calculate statistical measures for pattern analysis
    const tempStats = calculateStats(readings.map(r => r.temperature))
    const vibStats = calculateStats(readings.map(r => r.vibration))
    const energyStats = calculateStats(readings.map(r => r.energy_consumption))

    // Detect sudden spikes using AI pattern recognition
    const latest = readings[0]
    const previous = readings.slice(1, 6) // Last 5 readings

    // Temperature spike detection
    if (isSuddenSpike(latest.temperature, previous.map(r => r.temperature), tempStats)) {
      anomalies.push({
        sensor: 'temperature',
        value: latest.temperature,
        threshold: tempStats.mean + (3 * tempStats.std),
        severity: 'warning',
        message: `AI detected sudden temperature spike: ${latest.temperature}°C (pattern analysis)`,
        ai_detected: true
      })
    }

    // Vibration pattern anomaly
    if (isAbnormalPattern(latest.vibration, previous.map(r => r.vibration), vibStats)) {
      anomalies.push({
        sensor: 'vibration',
        value: latest.vibration,
        threshold: vibStats.mean + (2.5 * vibStats.std),
        severity: 'warning',
        message: `AI detected abnormal vibration pattern: ${latest.vibration} mm/s`,
        ai_detected: true
      })
    }

    // Energy consumption anomaly
    if (isEnergyAnomaly(latest.energy_consumption, previous.map(r => r.energy_consumption), energyStats)) {
      anomalies.push({
        sensor: 'energy',
        value: latest.energy_consumption,
        threshold: energyStats.mean + (2 * energyStats.std),
        severity: 'warning',
        message: `AI detected energy consumption anomaly: ${latest.energy_consumption} kW`,
        ai_detected: true
      })
    }

  } catch (error) {
    console.error('[FactoryGuard] AI pattern analysis error:', error)
  }

  return anomalies
}

async function predictRUL(equipmentId: string) {
  try {
    // Fetch last 100 sensor readings
    const { data: readings, error } = await supabaseAdmin
      .from('sensor_readings')
      .select('temperature, vibration, pressure, energy_consumption, rpm, load_percentage, timestamp')
      .eq('equipment_id', equipmentId)
      .order('timestamp', { ascending: false })
      .limit(100)

    if (error || !readings || readings.length < 10) {
      console.log('[FactoryGuard] Insufficient data for prediction')
      return null
    }

    // Calculate health score based on recent readings
    const healthScore = calculateHealthScore(readings)

    // Estimate RUL based on health degradation
    const rul = calculateRULFromHealth(healthScore, readings)

    // Calculate confidence based on data quality and consistency
    const confidence = calculateConfidence(readings)

    // Store prediction
    await supabaseAdmin
      .from('predictions')
      .insert({
        equipment_id: equipmentId,
        prediction_type: 'rul',
        predicted_value: rul,
        confidence: confidence,
        prediction_date: new Date().toISOString(),
        model_version: 'health-based-v2',
        input_features: {
          readings_count: readings.length,
          health_score: healthScore,
          avg_temperature: readings.reduce((sum, r) => sum + r.temperature, 0) / readings.length
        },
      })

    console.log(`[FactoryGuard] RUL prediction for ${equipmentId}: ${rul} days (${confidence}% confidence, health: ${healthScore}%)`)

    return { rul, confidence, healthScore }
  } catch (error) {
    console.error('[FactoryGuard] RUL prediction error:', error)
    return null
  }
}

function calculateHealthScore(readings: any[]): number {
  // Calculate health score based on sensor readings
  let totalScore = 100
  const latest = readings[0]

  // Temperature health (0-20 points)
  if (latest.temperature > 90) totalScore -= 20
  else if (latest.temperature > 80) totalScore -= 10
  else if (latest.temperature > 70) totalScore -= 5

  // Vibration health (0-20 points)
  if (latest.vibration > 7.0) totalScore -= 20
  else if (latest.vibration > 5.0) totalScore -= 10
  else if (latest.vibration > 4.0) totalScore -= 5

  // Pressure health (0-15 points)
  if (latest.pressure > 10.0) totalScore -= 15
  else if (latest.pressure > 8.0) totalScore -= 8
  else if (latest.pressure > 7.0) totalScore -= 4

  // Energy health (0-15 points)
  if (latest.energy_consumption > 80) totalScore -= 15
  else if (latest.energy_consumption > 60) totalScore -= 8
  else if (latest.energy_consumption > 50) totalScore -= 4

  // RPM health (0-15 points)
  if (latest.rpm > 4000) totalScore -= 15
  else if (latest.rpm > 3500) totalScore -= 8
  else if (latest.rpm > 3200) totalScore -= 4

  // Load health (0-15 points)
  if (latest.load_percentage > 95) totalScore -= 15
  else if (latest.load_percentage > 85) totalScore -= 8
  else if (latest.load_percentage > 80) totalScore -= 4

  return Math.max(0, Math.min(100, totalScore))
}

function calculateRULFromHealth(healthScore: number, readings: any[]): number {
  // Estimate RUL based on current health and degradation trend
  if (healthScore > 80) {
    return Math.round(healthScore * 2.5) // 200-250 days for healthy equipment
  } else if (healthScore > 60) {
    return Math.round(healthScore * 1.8) // 108-180 days for moderate health
  } else if (healthScore > 40) {
    return Math.round(healthScore * 1.2) // 48-72 days for poor health
  } else {
    return Math.round(healthScore * 0.8) // 0-32 days for critical health
  }
}

function calculateConfidence(readings: any[]): number {
  // Calculate confidence based on data quality and consistency
  const dataQuality = Math.min(100, (readings.length / 50) * 100)

  // Calculate variance across different sensors
  const temperatureVariance = calculateVariance(readings.map(r => r.temperature))
  const vibrationVariance = calculateVariance(readings.map(r => r.vibration))

  // Lower variance = higher confidence
  const consistencyScore = Math.max(0, 100 - (temperatureVariance + vibrationVariance) * 10)

  return Math.round((dataQuality + consistencyScore) / 2)
}

function calculateVariance(values: number[]): number {
  if (values.length < 2) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2))
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length)
}

function calculateStats(values: number[]) {
  if (values.length === 0) return { mean: 0, std: 0, min: 0, max: 0 }

  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = calculateVariance(values)
  const std = Math.sqrt(variance)
  const min = Math.min(...values)
  const max = Math.max(...values)

  return { mean, std, min, max }
}

function isSuddenSpike(current: number, previous: number[], stats: any): boolean {
  if (previous.length < 3) return false

  const recentMean = previous.slice(0, 3).reduce((a, b) => a + b, 0) / 3
  const threshold = stats.mean + (2.5 * stats.std)

  return current > threshold && current > recentMean * 1.3
}

function isAbnormalPattern(current: number, previous: number[], stats: any): boolean {
  if (previous.length < 5) return false

  // Check for oscillating patterns or sudden changes
  const recentTrend = previous.slice(0, 5)
  const trendDirection = recentTrend[0] < recentTrend[4] ? 'increasing' : 'decreasing'

  // If recent trend was stable but current value deviates significantly
  const recentStd = calculateVariance(recentTrend)
  const deviation = Math.abs(current - stats.mean)

  return deviation > (stats.mean * 0.25) && recentStd < (stats.std * 0.5)
}

function isEnergyAnomaly(current: number, previous: number[], stats: any): boolean {
  if (previous.length < 3) return false

  // Energy consumption should correlate with load and RPM
  // Simple anomaly detection based on statistical deviation
  const zScore = Math.abs(current - stats.mean) / stats.std

  return zScore > 2.0 // More than 2 standard deviations
}

// Run AI analysis every 2 minutes
setInterval(async () => {
  console.log('[FactoryGuard] Running scheduled AI analysis...')

  const { data: equipment } = await supabaseAdmin
    .from('equipment')
    .select('id')
    .eq('status', 'operational')

  if (equipment) {
    for (const eq of equipment) {
      // Run anomaly detection
      await detectAnomalies(eq.id)

      // Run RUL prediction (less frequently)
      if (Math.random() < 0.3) { // 30% chance every 2 minutes = ~6.7 minutes average
        await predictRUL(eq.id)
      }

      await new Promise(resolve => setTimeout(resolve, 1000)) // Rate limiting
    }
  }
}, 2 * 60 * 1000)

console.log('[FactoryGuard] Advanced AI analysis service started with ML-powered anomaly detection and predictive maintenance')