-- RetroWeb Builder Row Level Security Policies
-- Migration: 002_row_level_security

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE preview_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_library ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Pages policies
CREATE POLICY "Users can view pages in own projects"
  ON pages FOR SELECT
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create pages in own projects"
  ON pages FOR INSERT
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update pages in own projects"
  ON pages FOR UPDATE
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete pages in own projects"
  ON pages FOR DELETE
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Chat messages policies
CREATE POLICY "Users can view chat in own projects"
  ON chat_messages FOR SELECT
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create chat in own projects"
  ON chat_messages FOR INSERT
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete chat in own projects"
  ON chat_messages FOR DELETE
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- User assets policies
CREATE POLICY "Users can view own assets"
  ON user_assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assets"
  ON user_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets"
  ON user_assets FOR DELETE
  USING (auth.uid() = user_id);

-- Preview links policies
CREATE POLICY "Users can view own preview links"
  ON preview_links FOR SELECT
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create preview links for own projects"
  ON preview_links FOR INSERT
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own preview links"
  ON preview_links FOR DELETE
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Public access to preview links by token (for sharing)
CREATE POLICY "Anyone can view preview by token"
  ON preview_links FOR SELECT
  USING (true);

-- Asset library is readable by all authenticated users
CREATE POLICY "Asset library is public for authenticated users"
  ON asset_library FOR SELECT
  USING (auth.role() = 'authenticated');

-- Storage policies (for Supabase Storage)
-- These would be configured in the Supabase dashboard or via API
-- user-assets bucket: users can only access their own files
-- asset-library bucket: read-only for all authenticated users
