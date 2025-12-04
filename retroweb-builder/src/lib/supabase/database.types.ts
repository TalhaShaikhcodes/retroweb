// Database types generated from Supabase schema
// These types match the SQL schema in supabase/migrations/

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          github_username: string | null;
          github_access_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          github_username?: string | null;
          github_access_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          github_username?: string | null;
          github_access_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          theme: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          theme?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          theme?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      pages: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          slug: string;
          html: string;
          css: string;
          js: string;
          page_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name?: string;
          slug?: string;
          html?: string;
          css?: string;
          js?: string;
          page_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          slug?: string;
          html?: string;
          css?: string;
          js?: string;
          page_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          project_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          role?: 'user' | 'assistant';
          content?: string;
          created_at?: string;
        };
      };
      user_assets: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          name: string;
          type: 'gif' | 'image' | 'audio' | 'cursor';
          storage_path: string;
          size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          name: string;
          type: 'gif' | 'image' | 'audio' | 'cursor';
          storage_path: string;
          size_bytes?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          name?: string;
          type?: 'gif' | 'image' | 'audio' | 'cursor';
          storage_path?: string;
          size_bytes?: number | null;
          created_at?: string;
        };
      };
      preview_links: {
        Row: {
          id: string;
          project_id: string;
          token: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          token: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          token?: string;
          expires_at?: string;
          created_at?: string;
        };
      };
      asset_library: {
        Row: {
          id: string;
          name: string;
          type: 'gif' | 'audio' | 'cursor';
          category: string;
          tags: string[] | null;
          storage_path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'gif' | 'audio' | 'cursor';
          category: string;
          tags?: string[] | null;
          storage_path: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'gif' | 'audio' | 'cursor';
          category?: string;
          tags?: string[] | null;
          storage_path?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Page = Database['public']['Tables']['pages']['Row'];
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
export type UserAsset = Database['public']['Tables']['user_assets']['Row'];
export type PreviewLink = Database['public']['Tables']['preview_links']['Row'];
export type AssetLibraryItem = Database['public']['Tables']['asset_library']['Row'];
