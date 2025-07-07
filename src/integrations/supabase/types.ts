export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      approval_records: {
        Row: {
          approval_status: string | null
          approver_id: string
          approver_name: string
          approver_role: string
          comments: string | null
          created_at: string | null
          date: string | null
          decision: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approval_status?: string | null
          approver_id: string
          approver_name: string
          approver_role: string
          comments?: string | null
          created_at?: string | null
          date?: string | null
          decision: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approval_status?: string | null
          approver_id?: string
          approver_name?: string
          approver_role?: string
          comments?: string | null
          created_at?: string | null
          date?: string | null
          decision?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          clock_in: string | null
          clock_out: string | null
          created_at: string | null
          date: string
          employee_id: string
          id: string
          location: string | null
          notes: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          total_hours: number | null
        }
        Insert: {
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          date: string
          employee_id: string
          id?: string
          location?: string | null
          notes?: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          total_hours?: number | null
        }
        Update: {
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string
          id?: string
          location?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          total_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          budget: number | null
          created_at: string | null
          employee_count: number | null
          id: string
          manager: string
          manager_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          employee_count?: number | null
          id?: string
          manager: string
          manager_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          employee_count?: number | null
          id?: string
          manager?: string
          manager_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      document_requests: {
        Row: {
          additional_data: Json | null
          comments: string | null
          custom_description: string | null
          document_type: Database["public"]["Enums"]["document_request_type"]
          employee_id: string
          employee_name: string
          generated_document_url: string | null
          id: string
          processed_by: string | null
          processed_date: string | null
          status: Database["public"]["Enums"]["document_request_status"] | null
          submitted_date: string | null
        }
        Insert: {
          additional_data?: Json | null
          comments?: string | null
          custom_description?: string | null
          document_type: Database["public"]["Enums"]["document_request_type"]
          employee_id: string
          employee_name: string
          generated_document_url?: string | null
          id?: string
          processed_by?: string | null
          processed_date?: string | null
          status?: Database["public"]["Enums"]["document_request_status"] | null
          submitted_date?: string | null
        }
        Update: {
          additional_data?: Json | null
          comments?: string | null
          custom_description?: string | null
          document_type?: Database["public"]["Enums"]["document_request_type"]
          employee_id?: string
          employee_name?: string
          generated_document_url?: string | null
          id?: string
          processed_by?: string | null
          processed_date?: string | null
          status?: Database["public"]["Enums"]["document_request_status"] | null
          submitted_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          created_by: string
          created_date: string | null
          description: string
          id: string
          is_active: boolean | null
          name: string
          template_url: string
          type: Database["public"]["Enums"]["document_request_type"]
          variables: string[] | null
        }
        Insert: {
          created_by: string
          created_date?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          name: string
          template_url: string
          type: Database["public"]["Enums"]["document_request_type"]
          variables?: string[] | null
        }
        Update: {
          created_by?: string
          created_date?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          template_url?: string
          type?: Database["public"]["Enums"]["document_request_type"]
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "document_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          employee_id: string
          expiry_date: string | null
          id: string
          name: string
          size: number
          type: string
          uploaded_by: string
          uploaded_date: string | null
          url: string
        }
        Insert: {
          category: Database["public"]["Enums"]["document_category"]
          employee_id: string
          expiry_date?: string | null
          id?: string
          name: string
          size: number
          type: string
          uploaded_by: string
          uploaded_date?: string | null
          url: string
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          employee_id?: string
          expiry_date?: string | null
          id?: string
          name?: string
          size?: number
          type?: string
          uploaded_by?: string
          uploaded_date?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          avatar: string | null
          bank_account_number: string | null
          bank_name: string | null
          bank_routing_number: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          department: string
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employment_type: string | null
          first_name: string
          hire_date: string
          id: string
          job_description: string | null
          last_name: string
          manager_id: string | null
          notes: string | null
          office_location: string | null
          password: string | null
          phone: string | null
          position: string
          postal_code: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          salary: number | null
          salary_currency: string | null
          state: string | null
          status: Database["public"]["Enums"]["employee_status"] | null
          tax_id: string | null
          updated_at: string | null
          work_schedule: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bank_routing_number?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department: string
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employment_type?: string | null
          first_name: string
          hire_date: string
          id?: string
          job_description?: string | null
          last_name: string
          manager_id?: string | null
          notes?: string | null
          office_location?: string | null
          password?: string | null
          phone?: string | null
          position: string
          postal_code?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          salary?: number | null
          salary_currency?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          tax_id?: string | null
          updated_at?: string | null
          work_schedule?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bank_routing_number?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department?: string
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employment_type?: string | null
          first_name?: string
          hire_date?: string
          id?: string
          job_description?: string | null
          last_name?: string
          manager_id?: string | null
          notes?: string | null
          office_location?: string | null
          password?: string | null
          phone?: string | null
          position?: string
          postal_code?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          salary?: number | null
          salary_currency?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          tax_id?: string | null
          updated_at?: string | null
          work_schedule?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      file_attachments: {
        Row: {
          id: string
          name: string
          size: number
          type: string
          uploaded_date: string | null
          url: string
        }
        Insert: {
          id?: string
          name: string
          size: number
          type: string
          uploaded_date?: string | null
          url: string
        }
        Update: {
          id?: string
          name?: string
          size?: number
          type?: string
          uploaded_date?: string | null
          url?: string
        }
        Relationships: []
      }
      holidays: {
        Row: {
          created_at: string | null
          date: string
          id: string
          name: string
          recurring: boolean | null
          type: Database["public"]["Enums"]["holiday_type"]
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          name: string
          recurring?: boolean | null
          type: Database["public"]["Enums"]["holiday_type"]
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          name?: string
          recurring?: boolean | null
          type?: Database["public"]["Enums"]["holiday_type"]
        }
        Relationships: []
      }
      leave_balances: {
        Row: {
          allocated: number
          created_at: string | null
          employee_id: string
          id: string
          remaining: number
          type: Database["public"]["Enums"]["leave_type"]
          updated_at: string | null
          used: number
          year: number
        }
        Insert: {
          allocated?: number
          created_at?: string | null
          employee_id: string
          id?: string
          remaining?: number
          type: Database["public"]["Enums"]["leave_type"]
          updated_at?: string | null
          used?: number
          year?: number
        }
        Update: {
          allocated?: number
          created_at?: string | null
          employee_id?: string
          id?: string
          remaining?: number
          type?: Database["public"]["Enums"]["leave_type"]
          updated_at?: string | null
          used?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_request_attachments: {
        Row: {
          attachment_id: string
          leave_request_id: string
        }
        Insert: {
          attachment_id: string
          leave_request_id: string
        }
        Update: {
          attachment_id?: string
          leave_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_request_attachments_attachment_id_fkey"
            columns: ["attachment_id"]
            isOneToOne: false
            referencedRelation: "file_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_request_attachments_leave_request_id_fkey"
            columns: ["leave_request_id"]
            isOneToOne: false
            referencedRelation: "leave_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          calculated_days: number | null
          comments: string | null
          current_approval_step:
            | Database["public"]["Enums"]["approval_step"]
            | null
          duration: Database["public"]["Enums"]["time_duration"] | null
          employee_id: string
          employee_name: string
          end_date: string
          hr_approval_id: string | null
          id: string
          manager_approval_id: string | null
          reason: string
          review_date: string | null
          reviewed_by: string | null
          start_date: string
          status: Database["public"]["Enums"]["request_status"] | null
          submitted_date: string | null
          type: Database["public"]["Enums"]["leave_type"]
        }
        Insert: {
          calculated_days?: number | null
          comments?: string | null
          current_approval_step?:
            | Database["public"]["Enums"]["approval_step"]
            | null
          duration?: Database["public"]["Enums"]["time_duration"] | null
          employee_id: string
          employee_name: string
          end_date: string
          hr_approval_id?: string | null
          id?: string
          manager_approval_id?: string | null
          reason: string
          review_date?: string | null
          reviewed_by?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["request_status"] | null
          submitted_date?: string | null
          type: Database["public"]["Enums"]["leave_type"]
        }
        Update: {
          calculated_days?: number | null
          comments?: string | null
          current_approval_step?:
            | Database["public"]["Enums"]["approval_step"]
            | null
          duration?: Database["public"]["Enums"]["time_duration"] | null
          employee_id?: string
          employee_name?: string
          end_date?: string
          hr_approval_id?: string | null
          id?: string
          manager_approval_id?: string | null
          reason?: string
          review_date?: string | null
          reviewed_by?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          submitted_date?: string | null
          type?: Database["public"]["Enums"]["leave_type"]
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_hr_approval_id_fkey"
            columns: ["hr_approval_id"]
            isOneToOne: false
            referencedRelation: "approval_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_manager_approval_id_fkey"
            columns: ["manager_approval_id"]
            isOneToOne: false
            referencedRelation: "approval_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          date: string | null
          id: string
          link: string | null
          message: string
          read: boolean | null
          recipient_id: string
          sender_id: string | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          date?: string | null
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          recipient_id: string
          sender_id?: string | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          date?: string | null
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_goals: {
        Row: {
          comments: string | null
          description: string
          id: string
          rating: number | null
          status: Database["public"]["Enums"]["goal_status"] | null
          target_date: string
          title: string
        }
        Insert: {
          comments?: string | null
          description: string
          id?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["goal_status"] | null
          target_date: string
          title: string
        }
        Update: {
          comments?: string | null
          description?: string
          id?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["goal_status"] | null
          target_date?: string
          title?: string
        }
        Relationships: []
      }
      performance_review_goals: {
        Row: {
          goal_id: string
          review_id: string
        }
        Insert: {
          goal_id: string
          review_id: string
        }
        Update: {
          goal_id?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_review_goals_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "performance_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_review_goals_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "performance_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          comments: string
          completed_date: string | null
          created_date: string | null
          employee_id: string
          id: string
          overall_rating: number | null
          period: string
          reviewer_id: string
          status: Database["public"]["Enums"]["review_status"] | null
        }
        Insert: {
          comments: string
          completed_date?: string | null
          created_date?: string | null
          employee_id: string
          id?: string
          overall_rating?: number | null
          period: string
          reviewer_id: string
          status?: Database["public"]["Enums"]["review_status"] | null
        }
        Update: {
          comments?: string
          completed_date?: string | null
          created_date?: string | null
          employee_id?: string
          id?: string
          overall_rating?: number | null
          period?: string
          reviewer_id?: string
          status?: Database["public"]["Enums"]["review_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      remote_request_attachments: {
        Row: {
          attachment_id: string
          remote_request_id: string
        }
        Insert: {
          attachment_id: string
          remote_request_id: string
        }
        Update: {
          attachment_id?: string
          remote_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "remote_request_attachments_attachment_id_fkey"
            columns: ["attachment_id"]
            isOneToOne: false
            referencedRelation: "file_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remote_request_attachments_remote_request_id_fkey"
            columns: ["remote_request_id"]
            isOneToOne: false
            referencedRelation: "remote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      remote_requests: {
        Row: {
          calculated_days: number | null
          comments: string | null
          current_approval_step:
            | Database["public"]["Enums"]["approval_step"]
            | null
          duration: Database["public"]["Enums"]["time_duration"] | null
          employee_id: string
          employee_name: string
          end_date: string
          hr_approval_id: string | null
          id: string
          location: string | null
          manager_approval_id: string | null
          reason: string
          review_date: string | null
          reviewed_by: string | null
          start_date: string
          status: Database["public"]["Enums"]["request_status"] | null
          submitted_date: string | null
        }
        Insert: {
          calculated_days?: number | null
          comments?: string | null
          current_approval_step?:
            | Database["public"]["Enums"]["approval_step"]
            | null
          duration?: Database["public"]["Enums"]["time_duration"] | null
          employee_id: string
          employee_name: string
          end_date: string
          hr_approval_id?: string | null
          id?: string
          location?: string | null
          manager_approval_id?: string | null
          reason: string
          review_date?: string | null
          reviewed_by?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["request_status"] | null
          submitted_date?: string | null
        }
        Update: {
          calculated_days?: number | null
          comments?: string | null
          current_approval_step?:
            | Database["public"]["Enums"]["approval_step"]
            | null
          duration?: Database["public"]["Enums"]["time_duration"] | null
          employee_id?: string
          employee_name?: string
          end_date?: string
          hr_approval_id?: string | null
          id?: string
          location?: string | null
          manager_approval_id?: string | null
          reason?: string
          review_date?: string | null
          reviewed_by?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          submitted_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "remote_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remote_requests_hr_approval_id_fkey"
            columns: ["hr_approval_id"]
            isOneToOne: false
            referencedRelation: "approval_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remote_requests_manager_approval_id_fkey"
            columns: ["manager_approval_id"]
            isOneToOne: false
            referencedRelation: "approval_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remote_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          format: Database["public"]["Enums"]["report_format"]
          generated_by: string
          generated_date: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["report_type"]
          url: string | null
        }
        Insert: {
          format: Database["public"]["Enums"]["report_format"]
          generated_by: string
          generated_date?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["report_type"]
          url?: string | null
        }
        Update: {
          format?: Database["public"]["Enums"]["report_format"]
          generated_by?: string
          generated_date?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["report_type"]
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_history: {
        Row: {
          approved_by: string | null
          created_at: string | null
          currency: string | null
          effective_date: string
          employee_id: string
          id: string
          new_salary: number
          previous_salary: number | null
          reason: string | null
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          currency?: string | null
          effective_date: string
          employee_id: string
          id?: string
          new_salary: number
          previous_salary?: number | null
          reason?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          currency?: string | null
          effective_date?: string
          employee_id?: string
          id?: string
          new_salary?: number
          previous_salary?: number | null
          reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_history_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
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
      approval_step: "manager" | "hr"
      attendance_status: "present" | "absent" | "late" | "half-day" | "remote"
      document_category:
        | "cv"
        | "contract"
        | "diploma"
        | "id-card"
        | "passport"
        | "certification"
        | "other"
      document_request_status:
        | "pending"
        | "processing"
        | "completed"
        | "declined"
      document_request_type:
        | "payslip"
        | "work-certificate"
        | "salary-certificate"
        | "mission-order"
        | "custom"
      employee_status: "active" | "inactive" | "onLeave"
      goal_status: "not-started" | "in-progress" | "completed"
      holiday_type: "national" | "company" | "religious"
      leave_type:
        | "vacation"
        | "sick"
        | "personal"
        | "maternity"
        | "paternity"
        | "bereavement"
      notification_type: "info" | "success" | "warning" | "error"
      report_format: "pdf" | "csv" | "excel"
      report_type:
        | "attendance"
        | "leave"
        | "performance"
        | "department"
        | "custom"
      request_status:
        | "pending"
        | "manager-approved"
        | "hr-approved"
        | "approved"
        | "declined"
      review_status: "draft" | "submitted" | "completed"
      time_duration:
        | "full-day"
        | "half-day-morning"
        | "half-day-afternoon"
        | "quarter-day-1"
        | "quarter-day-2"
        | "quarter-day-3"
        | "quarter-day-4"
      user_role: "admin" | "manager" | "employee"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      approval_step: ["manager", "hr"],
      attendance_status: ["present", "absent", "late", "half-day", "remote"],
      document_category: [
        "cv",
        "contract",
        "diploma",
        "id-card",
        "passport",
        "certification",
        "other",
      ],
      document_request_status: [
        "pending",
        "processing",
        "completed",
        "declined",
      ],
      document_request_type: [
        "payslip",
        "work-certificate",
        "salary-certificate",
        "mission-order",
        "custom",
      ],
      employee_status: ["active", "inactive", "onLeave"],
      goal_status: ["not-started", "in-progress", "completed"],
      holiday_type: ["national", "company", "religious"],
      leave_type: [
        "vacation",
        "sick",
        "personal",
        "maternity",
        "paternity",
        "bereavement",
      ],
      notification_type: ["info", "success", "warning", "error"],
      report_format: ["pdf", "csv", "excel"],
      report_type: [
        "attendance",
        "leave",
        "performance",
        "department",
        "custom",
      ],
      request_status: [
        "pending",
        "manager-approved",
        "hr-approved",
        "approved",
        "declined",
      ],
      review_status: ["draft", "submitted", "completed"],
      time_duration: [
        "full-day",
        "half-day-morning",
        "half-day-afternoon",
        "quarter-day-1",
        "quarter-day-2",
        "quarter-day-3",
        "quarter-day-4",
      ],
      user_role: ["admin", "manager", "employee"],
    },
  },
} as const
