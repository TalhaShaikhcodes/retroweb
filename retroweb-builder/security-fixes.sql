-- ============================================
-- SECURITY FIXES FOR RETROWEB BUILDER
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. ENABLE RLS ON PROFILES TABLE (CRITICAL)
-- This is the most important fix!
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Verify the existing policies are active
-- (Supabase detected these policies exist but RLS was disabled)
-- Expected policies:
-- - "Users can view own profile"
-- - "Users can update own profile"

-- If policies don't exist, create them:
-- DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
-- DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- CREATE POLICY "Users can view own profile" 
-- ON public.profiles FOR SELECT 
-- USING (auth.uid() = id);

-- CREATE POLICY "Users can update own profile" 
-- ON public.profiles FOR UPDATE 
-- USING (auth.uid() = id);

-- 2. FIX FUNCTION SEARCH_PATH (SECURITY)
-- Prevents search_path injection attacks
ALTER FUNCTION public.check_user_gif_limit() SET search_path = public, pg_temp;
ALTER FUNCTION public.check_project_limit() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp;

-- 3. ADD ADDITIONAL SECURITY CONSTRAINTS (OPTIONAL BUT RECOMMENDED)

-- Limit project name length at database level
ALTER TABLE public.projects 
ADD CONSTRAINT project_name_length CHECK (char_length(name) <= 50 AND char_length(name) > 0);

-- Limit page name length
ALTER TABLE public.pages 
ADD CONSTRAINT page_name_length CHECK (char_length(name) <= 100 AND char_length(name) > 0);

-- Limit slug length and format
ALTER TABLE public.pages 
ADD CONSTRAINT page_slug_format CHECK (slug ~ '^[a-z0-9-]+$' AND char_length(slug) <= 100);

-- Limit HTML/CSS/JS content size (500KB, 100KB, 100KB)
ALTER TABLE public.pages 
ADD CONSTRAINT page_html_size CHECK (char_length(html) <= 500000);

ALTER TABLE public.pages 
ADD CONSTRAINT page_css_size CHECK (char_length(css) <= 100000);

ALTER TABLE public.pages 
ADD CONSTRAINT page_js_size CHECK (char_length(js) <= 100000);

-- Limit chat message content size (10KB)
ALTER TABLE public.chat_messages 
ADD CONSTRAINT message_content_size CHECK (char_length(content) <= 10000);

-- 4. VERIFY RLS IS ENABLED ON ALL PUBLIC TABLES
-- Check which tables have RLS enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Expected output: All tables should have rls_enabled = true

-- 5. VERIFY POLICIES EXIST
-- Check all RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. CREATE AUDIT LOG TABLE (OPTIONAL - FOR MONITORING)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs (you'll need to define admin role)
-- CREATE POLICY "Only admins can view audit logs" 
-- ON public.audit_logs FOR SELECT 
-- USING (auth.jwt() ->> 'role' = 'admin');

-- 7. ADD INDEXES FOR PERFORMANCE (SECURITY RELATED)
-- Index for faster user_id lookups (prevents timing attacks)
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_pages_project_id ON public.pages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON public.chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_user_assets_user_id ON public.user_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gifs_user_id ON public.user_gifs(user_id);

-- 8. VERIFY FOREIGN KEY CONSTRAINTS
-- Ensure cascading deletes are set up correctly
SELECT
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify fixes were applied
-- ============================================

-- Check RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check function search_path
SELECT 
  routine_name,
  routine_type,
  prosecdef as security_definer,
  proconfig as config
FROM information_schema.routines r
JOIN pg_proc p ON p.proname = r.routine_name
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Check constraints
SELECT
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type IN ('CHECK', 'FOREIGN KEY')
ORDER BY tc.table_name, tc.constraint_type;

-- ============================================
-- ROLLBACK (IF NEEDED)
-- ============================================

-- To rollback RLS (NOT RECOMMENDED):
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- To remove constraints:
-- ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS project_name_length;
-- ALTER TABLE public.pages DROP CONSTRAINT IF EXISTS page_name_length;
-- ALTER TABLE public.pages DROP CONSTRAINT IF EXISTS page_slug_format;
-- ALTER TABLE public.pages DROP CONSTRAINT IF EXISTS page_html_size;
-- ALTER TABLE public.pages DROP CONSTRAINT IF EXISTS page_css_size;
-- ALTER TABLE public.pages DROP CONSTRAINT IF EXISTS page_js_size;
-- ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS message_content_size;

-- ============================================
-- NOTES
-- ============================================

-- 1. Run this script in Supabase SQL Editor
-- 2. Review the output of verification queries
-- 3. Test your application after applying fixes
-- 4. Monitor for any constraint violations
-- 5. Update your application code to handle new constraints

-- ============================================
-- DONE!
-- ============================================
