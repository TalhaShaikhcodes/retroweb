import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validatePageContent } from '@/lib/validation';

// PATCH /api/projects/[id]/pages/[pageId] - Update page code
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  const { id: projectId, pageId } = await params;
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
  const { html, css, js } = body;

  const updates: Record<string, string> = {};
  if (html !== undefined) updates.html = html;
  if (css !== undefined) updates.css = css;
  if (js !== undefined) updates.js = js;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
  }

  // Validate content sizes
  const contentError = validatePageContent(
    html !== undefined ? html : '',
    css !== undefined ? css : '',
    js !== undefined ? js : ''
  );
  if (contentError) {
    return NextResponse.json({ error: contentError }, { status: 400 });
  }

  const { data: page, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', pageId)
    .eq('project_id', projectId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ page });
}
