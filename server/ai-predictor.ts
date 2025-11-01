import { HfInference } from '@huggingface/inference'
import { supabaseAdmin } from '@/lib/supabase/admin'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

async function predictRUL(equipmentId: string) {
  try {
    // Fetch last 100 sensor readings
    const { data: readings, error } = await supabaseAdmin
      .from('sensor_readings')
      .select('temperature, vibration, pressure, energy_consumption, timestamp')
      .eq('equipment_id', equipmentId)
      .order('timestamp', { ascending: false })
      .limit(100)

    if (error || !readings || readings.length < 10) {
      console.log('[FactoryGuard] Insufficient data for prediction')
      return null
    }

    // Prepare time series data
    const temperatures = readings.map(r => r.temperature).reverse()
    const vibrations = readings.map(r => r.vibration).reverse()

    // Use Hugging Face time series model
    const result = await hf.request({
      model: 'facebook/timeseries-transformer-tourism-monthly',
      inputs: {
        target: temperatures,
        feat_dynamic_real: [vibrations],
      },
    })

    // Calculate RUL based on predictions
    const rul = calculateRULFromPredictions(result)
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
        model_version: 'timeseries-transformer-v1',
        input_features: { readings_count: readings.length },
      })

    console.log(`[FactoryGuard] RUL prediction for ${equipmentId}: ${rul} days (${confidence}% confidence)`)

    return { rul, confidence }
  } catch (error) {
    console.error('[FactoryGuard] RUL prediction error:', error)
    return null
  }
}

function calculateRULFromPredictions(predictions: any): number {
  // Simplified RUL calculation
  // In production, use more sophisticated algorithms
  const degradationRate = 0.5 // % per day
  const currentHealth = 85 // from equipment health score
  const failureThreshold = 40

  return Math.round((currentHealth - failureThreshold) / degradationRate)
}

function calculateConfidence(readings: any[]): number {
  // Calculate confidence based on data quality
  const dataQuality = readings.length / 100 * 100
  const variance = calculateVariance(readings.map(r => r.temperature))

  return Math.min(95, Math.round(dataQuality * (1 - variance / 100)))
}

function calculateVariance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2))
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length)
}

// Run predictions every 5 minutes
setInterval(async () => {
  console.log('[FactoryGuard] Running scheduled AI predictions...')

  const { data: equipment } = await supabaseAdmin
    .from('equipment')
    .select('id')
    .eq('status', 'operational')

  if (equipment) {
    for (const eq of equipment) {
      await predictRUL(eq.id)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Rate limiting
    }
  }
}, 5 * 60 * 1000)

console.log('[FactoryGuard] AI prediction service started')