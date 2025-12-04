import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validatePageName, validateSlug } from '@/lib/validation';

// POST /api/projects/[id]/pages - Create a new page
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const body = await request.json();
  const { name, slug, html, css, js } = body;

  // Validate page name
  const nameError = validatePageName(name);
  if (nameError) {
    return NextResponse.json({ error: nameError }, { status: 400 });
  }

  // Validate and sanitize slug
  const slugValidation = validateSlug(slug);
  if (!slugValidation.valid) {
    return NextResponse.json({ error: slugValidation.error }, { status: 400 });
  }

  // Get the highest page_order for this project
  const { data: existingPages } = await supabase
    .from('pages')
    .select('page_order')
    .eq('project_id', projectId)
    .order('page_order', { ascending: false })
    .limit(1);

  const nextOrder = existingPages && existingPages.length > 0 
    ? existingPages[0].page_order + 1 
    : 0;

  const { data: page, error } = await supabase
    .from('pages')
    .insert({
      project_id: projectId,
      name: name.trim(),
      slug: slugValidation.sanitized,
      html: html || '',
      css: css || '',
      js: js || '',
      page_order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ page });
}
