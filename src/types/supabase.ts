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
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          role: string
          created_at: string | null
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar_url?: string | null
          role?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          role?: string
          created_at?: string | null
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          level: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          level: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          level?: string
          user_id?: string
        }
      }
      hackathons: {
        Row: {
          id: string
          name: string
          description: string
          start_date: string
          end_date: string
          location: string
          is_online: boolean
          prizes: string[]
          organizer: string
          organizer_logo: string
          registration_deadline: string
          max_team_size: number
          min_team_size: number
          website: string
          categories: string[]
          tags: string[]
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          start_date: string
          end_date: string
          location: string
          is_online: boolean
          prizes: string[]
          organizer: string
          organizer_logo: string
          registration_deadline: string
          max_team_size: number
          min_team_size: number
          website: string
          categories: string[]
          tags: string[]
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string
          is_online?: boolean
          prizes?: string[]
          organizer?: string
          organizer_logo?: string
          registration_deadline?: string
          max_team_size?: number
          min_team_size?: number
          website?: string
          categories?: string[]
          tags?: string[]
          created_at?: string | null
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          hackathon_id: string
          members: string[]
          leader: string
          description: string
          looking_for_roles: string[]
          created_at: string | null
          project_repo: string | null
          project_demo: string | null
        }
        Insert: {
          id?: string
          name: string
          hackathon_id: string
          members: string[]
          leader: string
          description: string
          looking_for_roles: string[]
          created_at?: string | null
          project_repo?: string | null
          project_demo?: string | null
        }
        Update: {
          id?: string
          name?: string
          hackathon_id?: string
          members?: string[]
          leader?: string
          description?: string
          looking_for_roles?: string[]
          created_at?: string | null
          project_repo?: string | null
          project_demo?: string | null
        }
      }
      team_requests: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          message: string
          status: string
          created_at: string | null
          hackathon_id: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          message: string
          status?: string
          created_at?: string | null
          hackathon_id: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          message?: string
          status?: string
          created_at?: string | null
          hackathon_id?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string
          technologies: string[]
          url: string | null
          image_url: string | null
          hackathon_id: string | null
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          technologies: string[]
          url?: string | null
          image_url?: string | null
          hackathon_id?: string | null
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          technologies?: string[]
          url?: string | null
          image_url?: string | null
          hackathon_id?: string | null
          user_id?: string
          created_at?: string | null
        }
      }
      direct_messages: {
        Row: {
          id: number
          sender_id: string
          recipient_id: string
          content: string
          read: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: number
          sender_id: string
          recipient_id: string
          content: string
          read?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: number
          sender_id?: string
          recipient_id?: string
          content?: string
          read?: boolean | null
          created_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          message: string
          related_id: string | null
          read: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          message: string
          related_id?: string | null
          read?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          message?: string
          related_id?: string | null
          read?: boolean
          created_at?: string | null
        }
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
  }
}