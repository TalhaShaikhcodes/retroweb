import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getTemplate } from '@/lib/templates';
import { validateProjectName, MAX_PROJECTS_PER_USER } from '@/lib/validation';

// GET /api/projects - List user's projects
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects });
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check project limit
  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (count !== null && count >= MAX_PROJECTS_PER_USER) {
    return NextResponse.json(
      { error: `Maximum of ${MAX_PROJECTS_PER_USER} projects allowed` },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { name, theme = 'geocities-chaos', template = 'blank' } = body;

  // Validate project name
  const nameError = validateProjectName(name);
  if (nameError) {
    return NextResponse.json({ error: nameError }, { status: 400 });
  }

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: name.trim(),
      theme,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get template content
  const templateData = getTemplate(template);
  console.log('[API] Template requested:', template);
  console.log('[API] Template data found:', !!templateData);
  console.log('[API] HTML length:', templateData?.html?.length || 0);
  
  const html = templateData?.html || '';
  const css = templateData?.css || '';
  const js = templateData?.js || '';

  // Create default index page for the project with template content
  const { error: pageError } = await supabase.from('pages').insert({
    project_id: project.id,
    name: 'Home',
    slug: 'index',
    html,
    css,
    js,
    page_order: 0,
  });
  
  if (pageError) {
    console.error('[API] Failed to create page:', pageError);
  } else {
    console.log('[API] Page created with template content');
  }

  return NextResponse.json({ project }, { status: 201 });
}
