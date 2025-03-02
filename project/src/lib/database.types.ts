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
          display_name: string
          profile_tag: string
          avatar_url: string | null
          banner_url: string | null
          status_message: string | null
          level: number
          xp: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          profile_tag: string
          avatar_url?: string | null
          banner_url?: string | null
          status_message?: string | null
          level?: number
          xp?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          profile_tag?: string
          avatar_url?: string | null
          banner_url?: string | null
          status_message?: string | null
          level?: number
          xp?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}