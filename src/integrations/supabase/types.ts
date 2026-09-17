export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      biopsy_records: {
        Row: {
          biopsy_date: string
          c_score: string | null
          created_at: string
          e_score: string | null
          file_url: string | null
          globally_sclerotic_glomeruli: number | null
          hospital: string | null
          id: string
          m_score: string | null
          notes: string | null
          patient_id: string
          s_score: string | null
          t_score: string | null
          total_glomeruli: number | null
        }
        Insert: {
          biopsy_date: string
          c_score?: string | null
          created_at?: string
          e_score?: string | null
          file_url?: string | null
          globally_sclerotic_glomeruli?: number | null
          hospital?: string | null
          id?: string
          m_score?: string | null
          notes?: string | null
          patient_id: string
          s_score?: string | null
          t_score?: string | null
          total_glomeruli?: number | null
        }
        Update: {
          biopsy_date?: string
          c_score?: string | null
          created_at?: string
          e_score?: string | null
          file_url?: string | null
          globally_sclerotic_glomeruli?: number | null
          hospital?: string | null
          id?: string
          m_score?: string | null
          notes?: string | null
          patient_id?: string
          s_score?: string | null
          t_score?: string | null
          total_glomeruli?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "biopsy_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          event_type: string
          id: string
          patient_id: string
          title: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          event_type: string
          id?: string
          patient_id: string
          title: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          event_type?: string
          id?: string
          patient_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      family_access: {
        Row: {
          created_at: string
          id: string
          member_name: string
          patient_id: string
          relation: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          member_name: string
          patient_id: string
          relation?: string | null
          role?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          member_name?: string
          patient_id?: string
          relation?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_access_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      food_items: {
        Row: {
          calories: number | null
          id: string
          name: string
          phosphorus_mg: number | null
          potassium_mg: number | null
          protein_g: number
          serving_grams: number | null
          serving_size: string
          sodium_mg: number | null
        }
        Insert: {
          calories?: number | null
          id?: string
          name: string
          phosphorus_mg?: number | null
          potassium_mg?: number | null
          protein_g: number
          serving_grams?: number | null
          serving_size: string
          sodium_mg?: number | null
        }
        Update: {
          calories?: number | null
          id?: string
          name?: string
          phosphorus_mg?: number | null
          potassium_mg?: number | null
          protein_g?: number
          serving_grams?: number | null
          serving_size?: string
          sodium_mg?: number | null
        }
        Relationships: []
      }
      food_logs: {
        Row: {
          amount: number
          created_at: string
          date: string
          food_item_id: string
          id: string
          patient_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          date?: string
          food_item_id: string
          id?: string
          patient_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          food_item_id?: string
          id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_logs_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_results: {
        Row: {
          canonical_name: string
          confidence: number | null
          confirmed_value: number | null
          created_at: string
          extracted_value: number | null
          id: string
          measured_at: string
          normalized_unit: string | null
          normalized_value: number | null
          original_name: string | null
          original_unit: string | null
          patient_id: string
          reference_max: number | null
          reference_min: number | null
          report_id: string | null
        }
        Insert: {
          canonical_name: string
          confidence?: number | null
          confirmed_value?: number | null
          created_at?: string
          extracted_value?: number | null
          id?: string
          measured_at: string
          normalized_unit?: string | null
          normalized_value?: number | null
          original_name?: string | null
          original_unit?: string | null
          patient_id: string
          reference_max?: number | null
          reference_min?: number | null
          report_id?: string | null
        }
        Update: {
          canonical_name?: string
          confidence?: number | null
          confirmed_value?: number | null
          created_at?: string
          extracted_value?: number | null
          id?: string
          measured_at?: string
          normalized_unit?: string | null
          normalized_value?: number | null
          original_name?: string | null
          original_unit?: string | null
          patient_id?: string
          reference_max?: number | null
          reference_min?: number | null
          report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_results_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_results_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      measurements: {
        Row: {
          created_at: string
          id: string
          note: string | null
          patient_id: string
          timestamp: string
          type: string
          unit: string | null
          value: number
          value2: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          patient_id: string
          timestamp?: string
          type: string
          unit?: string | null
          value: number
          value2?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          patient_id?: string
          timestamp?: string
          type?: string
          unit?: string | null
          value?: number
          value2?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measurements_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          doctor: string | null
          dose: string | null
          drug_name: string
          frequency: string | null
          id: string
          notes: string | null
          patient_id: string
          start_date: string | null
          stop_date: string | null
        }
        Insert: {
          created_at?: string
          doctor?: string | null
          dose?: string | null
          drug_name: string
          frequency?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          start_date?: string | null
          stop_date?: string | null
        }
        Update: {
          created_at?: string
          doctor?: string | null
          dose?: string | null
          drug_name?: string
          frequency?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          start_date?: string | null
          stop_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_targets: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          protein_target_g: number
          source: string
          start_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          protein_target_g: number
          source?: string
          start_date?: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          protein_target_g?: number
          source?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_targets_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          birth_year: number | null
          created_at: string
          diagnosis: string | null
          diagnosis_date: string | null
          id: string
          is_demo: boolean
          name: string
          owner_user_id: string | null
          sex: string | null
        }
        Insert: {
          birth_year?: number | null
          created_at?: string
          diagnosis?: string | null
          diagnosis_date?: string | null
          id?: string
          is_demo?: boolean
          name: string
          owner_user_id?: string | null
          sex?: string | null
        }
        Update: {
          birth_year?: number | null
          created_at?: string
          diagnosis?: string | null
          diagnosis_date?: string | null
          id?: string
          is_demo?: boolean
          name?: string
          owner_user_id?: string | null
          sex?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          file_url: string | null
          hospital: string | null
          id: string
          patient_id: string
          report_date: string
          report_type: string
          source_kind: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          hospital?: string | null
          id?: string
          patient_id: string
          report_date: string
          report_type: string
          source_kind?: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          file_url?: string | null
          hospital?: string | null
          id?: string
          patient_id?: string
          report_date?: string
          report_type?: string
          source_kind?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_patient: { Args: { p: string }; Returns: boolean }
      can_edit_patient: { Args: { p: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
