export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      folders: {
        Row: {
          folder_id: string
          folder_name: string
          owner_id: string
          parent_id: string | null
        }
        Insert: {
          folder_id?: string
          folder_name?: string
          owner_id: string
          parent_id?: string | null
        }
        Update: {
          folder_id?: string
          folder_name?: string
          owner_id?: string
          parent_id?: string | null
        }
      }
      notes: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          slug: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          slug?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          slug?: string | null
        }
      }
      notes_v2: {
        Row: {
          content: string
          created_at: string
          note_id: string
          note_name: string
          owner_id: string | null
          parent_id: string | null
          private: boolean
          slug: string
        }
        Insert: {
          content: string
          created_at?: string
          note_id?: string
          note_name?: string
          owner_id?: string | null
          parent_id?: string | null
          private?: boolean
          slug: string
        }
        Update: {
          content?: string
          created_at?: string
          note_id?: string
          note_name?: string
          owner_id?: string | null
          parent_id?: string | null
          private?: boolean
          slug?: string
        }
      }
      profiles: {
        Row: {
          email: string | null
          id: string
          pro: boolean | null
          username: string | null
        }
        Insert: {
          email?: string | null
          id: string
          pro?: boolean | null
          username?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          pro?: boolean | null
          username?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
