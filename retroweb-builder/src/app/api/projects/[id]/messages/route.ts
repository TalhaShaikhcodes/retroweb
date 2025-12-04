import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateMessageContent } from '@/lib/validation';

// POST /api/projects/[id]/messages - Save a chat message
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
  const { role, content } = body;

  if (!role || !content) {
    return NextResponse.json({ error: 'Role and content are required' }, { status: 400 });
  }

  if (!['user', 'assistant'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  // Validate message content
  const contentError = validateMessageContent(content);
  if (contentError) {
    return NextResponse.json({ error: contentError }, { status: 400 });
  }

  const { data: message, error } = await supabase
    .from('chat_messages')
    .insert({
      project_id: projectId,
      role,
      content,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message });
}
