export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      association_settings: {
        Row: {
          association_id: string | null
          created_at: string | null
          id: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          association_id?: string | null
          created_at?: string | null
          id?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          association_id?: string | null
          created_at?: string | null
          id?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "association_settings_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: true
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
        ]
      }
      associations: {
        Row: {
          address: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_website: string | null
          country: string | null
          created_at: string | null
          description: string | null
          founded_date: string | null
          id: string
          name: string
          state: string | null
          status: string | null
          type: string | null
          units: number | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_website?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_date?: string | null
          id?: string
          name: string
          state?: string | null
          status?: string | null
          type?: string | null
          units?: number | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_website?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_date?: string | null
          id?: string
          name?: string
          state?: string | null
          status?: string | null
          type?: string | null
          units?: number | null
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      bid_request_vendors: {
        Row: {
          bid_amount: number | null
          bid_request_id: string
          created_at: string
          estimated_completion_date: string | null
          id: string
          response_date: string | null
          response_notes: string | null
          status: string
          vendor_id: string
        }
        Insert: {
          bid_amount?: number | null
          bid_request_id: string
          created_at?: string
          estimated_completion_date?: string | null
          id?: string
          response_date?: string | null
          response_notes?: string | null
          status?: string
          vendor_id: string
        }
        Update: {
          bid_amount?: number | null
          bid_request_id?: string
          created_at?: string
          estimated_completion_date?: string | null
          id?: string
          response_date?: string | null
          response_notes?: string | null
          status?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bid_request_vendors_bid_request_id_fkey"
            columns: ["bid_request_id"]
            isOneToOne: false
            referencedRelation: "bid_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_requests: {
        Row: {
          answers: Json
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          project_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          project_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          project_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      communication_recipients: {
        Row: {
          communication_id: string | null
          created_at: string
          id: string
          recipient_email: string
          recipient_type: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          communication_id?: string | null
          created_at?: string
          id?: string
          recipient_email: string
          recipient_type?: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          communication_id?: string | null
          created_at?: string
          id?: string
          recipient_email?: string
          recipient_type?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_recipients_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          category: string | null
          content: string
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          subject: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      communications: {
        Row: {
          content: string
          created_at: string
          format: string
          id: string
          message_type: string
          scheduled_for: string | null
          status: string
          subject: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          format?: string
          id?: string
          message_type?: string
          scheduled_for?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          format?: string
          id?: string
          message_type?: string
          scheduled_for?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      document_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          association_id: string
          category: string | null
          description: string | null
          file_size: number
          file_type: string
          id: string
          is_archived: boolean | null
          is_public: boolean | null
          last_modified: string | null
          name: string
          tags: string[] | null
          uploaded_by: string | null
          uploaded_date: string | null
          url: string
          version: number | null
        }
        Insert: {
          association_id: string
          category?: string | null
          description?: string | null
          file_size: number
          file_type: string
          id?: string
          is_archived?: boolean | null
          is_public?: boolean | null
          last_modified?: string | null
          name: string
          tags?: string[] | null
          uploaded_by?: string | null
          uploaded_date?: string | null
          url: string
          version?: number | null
        }
        Update: {
          association_id?: string
          category?: string | null
          description?: string | null
          file_size?: number
          file_type?: string
          id?: string
          is_archived?: boolean | null
          is_public?: boolean | null
          last_modified?: string | null
          name?: string
          tags?: string[] | null
          uploaded_by?: string | null
          uploaded_date?: string | null
          url?: string
          version?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          profile_image_url: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          association_id: string | null
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          created_at: string | null
          id: string
          property_type: string | null
          square_feet: number | null
          state: string | null
          unit_number: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address: string
          association_id?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          created_at?: string | null
          id?: string
          property_type?: string | null
          square_feet?: number | null
          state?: string | null
          unit_number?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string
          association_id?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          created_at?: string | null
          id?: string
          property_type?: string | null
          square_feet?: number | null
          state?: string | null
          unit_number?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
        ]
      }
      resale_certificates: {
        Row: {
          assessment_frequency: string | null
          association_name: string
          closing_date: string | null
          created_at: string | null
          created_by: string | null
          id: string
          litigation: string | null
          outstanding_balance: number | null
          owner_name: string
          property_id: string | null
          regular_assessment: number | null
          special_assessment: string | null
          status: string | null
          transfer_fee: number | null
          updated_at: string | null
          violations: string | null
        }
        Insert: {
          assessment_frequency?: string | null
          association_name: string
          closing_date?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          litigation?: string | null
          outstanding_balance?: number | null
          owner_name: string
          property_id?: string | null
          regular_assessment?: number | null
          special_assessment?: string | null
          status?: string | null
          transfer_fee?: number | null
          updated_at?: string | null
          violations?: string | null
        }
        Update: {
          assessment_frequency?: string | null
          association_name?: string
          closing_date?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          litigation?: string | null
          outstanding_balance?: number | null
          owner_name?: string
          property_id?: string | null
          regular_assessment?: number | null
          special_assessment?: string | null
          status?: string | null
          transfer_fee?: number | null
          updated_at?: string | null
          violations?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resale_certificates_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      residents: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          move_in_date: string | null
          move_out_date: string | null
          property_id: string | null
          resident_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          move_in_date?: string | null
          move_out_date?: string | null
          property_id?: string | null
          resident_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          move_in_date?: string | null
          move_out_date?: string | null
          property_id?: string | null
          resident_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "residents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          preference_data: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preference_data?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preference_data?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_documents: {
        Row: {
          document_type: string | null
          expiration_date: string | null
          file_path: string
          file_type: string | null
          id: string
          name: string
          size: number | null
          uploaded_at: string | null
          uploaded_by: string | null
          vendor_id: string | null
        }
        Insert: {
          document_type?: string | null
          expiration_date?: string | null
          file_path: string
          file_type?: string | null
          id?: string
          name: string
          size?: number | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          vendor_id?: string | null
        }
        Update: {
          document_type?: string | null
          expiration_date?: string | null
          file_path?: string
          file_type?: string | null
          id?: string
          name?: string
          size?: number | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          vendor_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          vendor_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_notes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_services: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          rate: number | null
          rate_type: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          rate?: number | null
          rate_type?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          rate?: number | null
          rate_type?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_services_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address1: string | null
          address2: string | null
          check_name: string | null
          city: string | null
          compliance_group: string | null
          compliance_status: string | null
          contact_name: string | null
          created_at: string | null
          dba: string | null
          default_payment_method: string | null
          email: string | null
          hold_payment: boolean | null
          hold_reason: string | null
          id: string
          insurance: Json | null
          is_1099: boolean | null
          is_compliant: boolean | null
          is_default: boolean | null
          is_preferred: boolean | null
          name: string
          notes: string | null
          old_provider_id: string | null
          phone: string | null
          provider_type: string | null
          report_1099_box: string | null
          state: string | null
          status: string | null
          street_no: string | null
          tags: Json | null
          tax_id: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          check_name?: string | null
          city?: string | null
          compliance_group?: string | null
          compliance_status?: string | null
          contact_name?: string | null
          created_at?: string | null
          dba?: string | null
          default_payment_method?: string | null
          email?: string | null
          hold_payment?: boolean | null
          hold_reason?: string | null
          id?: string
          insurance?: Json | null
          is_1099?: boolean | null
          is_compliant?: boolean | null
          is_default?: boolean | null
          is_preferred?: boolean | null
          name: string
          notes?: string | null
          old_provider_id?: string | null
          phone?: string | null
          provider_type?: string | null
          report_1099_box?: string | null
          state?: string | null
          status?: string | null
          street_no?: string | null
          tags?: Json | null
          tax_id?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          check_name?: string | null
          city?: string | null
          compliance_group?: string | null
          compliance_status?: string | null
          contact_name?: string | null
          created_at?: string | null
          dba?: string | null
          default_payment_method?: string | null
          email?: string | null
          hold_payment?: boolean | null
          hold_reason?: string | null
          id?: string
          insurance?: Json | null
          is_1099?: boolean | null
          is_compliant?: boolean | null
          is_default?: boolean | null
          is_preferred?: boolean | null
          name?: string
          notes?: string | null
          old_provider_id?: string | null
          phone?: string | null
          provider_type?: string | null
          report_1099_box?: string | null
          state?: string | null
          status?: string | null
          street_no?: string | null
          tags?: Json | null
          tax_id?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      violation_attachments: {
        Row: {
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          uploaded_at: string | null
          uploaded_by: string | null
          violation_id: string | null
        }
        Insert: {
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          violation_id?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          violation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "violation_attachments_violation_id_fkey"
            columns: ["violation_id"]
            isOneToOne: false
            referencedRelation: "violations"
            referencedColumns: ["id"]
          },
        ]
      }
      violation_communications: {
        Row: {
          communication_type: string | null
          created_at: string | null
          delivery_status: string | null
          id: string
          message: string
          sent_by: string | null
          sent_date: string | null
          sent_to: string | null
          violation_id: string | null
        }
        Insert: {
          communication_type?: string | null
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          message: string
          sent_by?: string | null
          sent_date?: string | null
          sent_to?: string | null
          violation_id?: string | null
        }
        Update: {
          communication_type?: string | null
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          message?: string
          sent_by?: string | null
          sent_date?: string | null
          sent_to?: string | null
          violation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "violation_communications_violation_id_fkey"
            columns: ["violation_id"]
            isOneToOne: false
            referencedRelation: "violations"
            referencedColumns: ["id"]
          },
        ]
      }
      violation_templates: {
        Row: {
          association_id: string | null
          category: string | null
          created_at: string | null
          default_due_days: number | null
          default_fine: number | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          severity: string | null
          updated_at: string | null
        }
        Insert: {
          association_id?: string | null
          category?: string | null
          created_at?: string | null
          default_due_days?: number | null
          default_fine?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          severity?: string | null
          updated_at?: string | null
        }
        Update: {
          association_id?: string | null
          category?: string | null
          created_at?: string | null
          default_due_days?: number | null
          default_fine?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          severity?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "violation_templates_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
        ]
      }
      violations: {
        Row: {
          association_id: string | null
          created_at: string | null
          description: string | null
          id: string
          property_id: string | null
          reported_date: string | null
          resolved_date: string | null
          status: string | null
          updated_at: string | null
          violation_type: string
        }
        Insert: {
          association_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          property_id?: string | null
          reported_date?: string | null
          resolved_date?: string | null
          status?: string | null
          updated_at?: string | null
          violation_type: string
        }
        Update: {
          association_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          property_id?: string | null
          reported_date?: string | null
          resolved_date?: string | null
          status?: string | null
          updated_at?: string | null
          violation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "violations_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "violations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
