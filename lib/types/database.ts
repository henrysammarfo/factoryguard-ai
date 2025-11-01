export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      equipment: {
        Row: {
          id: string
          name: string
          type: string
          location: string
          manufacturer: string | null
          model: string | null
          serial_number: string | null
          installation_date: string | null
          status: string
          health_score: number
          last_maintenance: string | null
          next_maintenance: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          location: string
          manufacturer?: string | null
          model?: string | null
          serial_number?: string | null
          installation_date?: string | null
          status?: string
          health_score?: number
          last_maintenance?: string | null
          next_maintenance?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          location?: string
          manufacturer?: string | null
          model?: string | null
          serial_number?: string | null
          installation_date?: string | null
          status?: string
          health_score?: number
          last_maintenance?: string | null
          next_maintenance?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      sensor_readings: {
        Row: {
          id: string
          equipment_id: string
          timestamp: string
          temperature: number | null
          vibration: number | null
          pressure: number | null
          energy_consumption: number | null
          rpm: number | null
          load_percentage: number | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          timestamp?: string
          temperature?: number | null
          vibration?: number | null
          pressure?: number | null
          energy_consumption?: number | null
          rpm?: number | null
          load_percentage?: number | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          timestamp?: string
          temperature?: number | null
          vibration?: number | null
          pressure?: number | null
          energy_consumption?: number | null
          rpm?: number | null
          load_percentage?: number | null
          metadata?: Json
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          equipment_id: string
          severity: string
          type: string
          message: string
          recommended_action: string | null
          acknowledged: boolean
          acknowledged_by: string | null
          acknowledged_at: string | null
          resolved: boolean
          resolved_at: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          severity: string
          type: string
          message: string
          recommended_action?: string | null
          acknowledged?: boolean
          acknowledged_by?: string | null
          acknowledged_at?: string | null
          resolved?: boolean
          resolved_at?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          severity?: string
          type?: string
          message?: string
          recommended_action?: string | null
          acknowledged?: boolean
          acknowledged_by?: string | null
          acknowledged_at?: string | null
          resolved?: boolean
          resolved_at?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      predictions: {
        Row: {
          id: string
          equipment_id: string
          prediction_type: string
          predicted_value: number | null
          confidence: number
          prediction_date: string
          model_version: string | null
          input_features: Json | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          prediction_type: string
          predicted_value?: number | null
          confidence?: number
          prediction_date?: string
          model_version?: string | null
          input_features?: Json | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          prediction_type?: string
          predicted_value?: number | null
          confidence?: number
          prediction_date?: string
          model_version?: string | null
          input_features?: Json | null
          metadata?: Json
          created_at?: string
        }
      }
      maintenance_logs: {
        Row: {
          id: string
          equipment_id: string
          maintenance_type: string
          description: string
          technician: string | null
          duration_minutes: number | null
          cost: number | null
          parts_replaced: string[] | null
          status: string
          scheduled_date: string | null
          completed_date: string | null
          notes: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          maintenance_type: string
          description: string
          technician?: string | null
          duration_minutes?: number | null
          cost?: number | null
          parts_replaced?: string[] | null
          status?: string
          scheduled_date?: string | null
          completed_date?: string | null
          notes?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          maintenance_type?: string
          description?: string
          technician?: string | null
          duration_minutes?: number | null
          cost?: number | null
          parts_replaced?: string[] | null
          status?: string
          scheduled_date?: string | null
          completed_date?: string | null
          notes?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      oee_metrics: {
        Row: {
          id: string
          equipment_id: string
          timestamp: string
          availability: number
          performance: number
          quality: number
          oee: number
          planned_production_time: number | null
          actual_production_time: number | null
          downtime_minutes: number | null
          ideal_cycle_time: number | null
          total_pieces: number | null
          good_pieces: number | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          timestamp?: string
          availability?: number
          performance?: number
          quality?: number
          oee?: number
          planned_production_time?: number | null
          actual_production_time?: number | null
          downtime_minutes?: number | null
          ideal_cycle_time?: number | null
          total_pieces?: number | null
          good_pieces?: number | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          timestamp?: string
          availability?: number
          performance?: number
          quality?: number
          oee?: number
          planned_production_time?: number | null
          actual_production_time?: number | null
          downtime_minutes?: number | null
          ideal_cycle_time?: number | null
          total_pieces?: number | null
          good_pieces?: number | null
          metadata?: Json
          created_at?: string
        }
      }
      downtime_events: {
        Row: {
          id: string
          equipment_id: string
          start_time: string
          end_time: string | null
          duration_minutes: number | null
          reason: string
          category: string | null
          description: string | null
          cost_impact: number | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          start_time?: string
          end_time?: string | null
          duration_minutes?: number | null
          reason: string
          category?: string | null
          description?: string | null
          cost_impact?: number | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          start_time?: string
          end_time?: string | null
          duration_minutes?: number | null
          reason?: string
          category?: string | null
          description?: string | null
          cost_impact?: number | null
          metadata?: Json
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          alert_thresholds: Json
          notification_preferences: Json
          dashboard_layout: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          alert_thresholds?: Json
          notification_preferences?: Json
          dashboard_layout?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          alert_thresholds?: Json
          notification_preferences?: Json
          dashboard_layout?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      equipment_health_summary: {
        Row: {
          id: string | null
          name: string | null
          type: string | null
          status: string | null
          health_score: number | null
          active_alerts: number | null
          last_reading: string | null
          avg_temperature: number | null
          avg_vibration: number | null
          avg_energy: number | null
        }
      }
      recent_alerts_summary: {
        Row: {
          id: string | null
          equipment_id: string | null
          severity: string | null
          type: string | null
          message: string | null
          recommended_action: string | null
          acknowledged: boolean | null
          acknowledged_by: string | null
          acknowledged_at: string | null
          resolved: boolean | null
          resolved_at: string | null
          metadata: Json | null
          created_at: string | null
          equipment_name: string | null
          equipment_type: string | null
          equipment_location: string | null
        }
      }
    }
    Functions: {
      calculate_oee: {
        Args: {
          p_availability: number
          p_performance: number
          p_quality: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}