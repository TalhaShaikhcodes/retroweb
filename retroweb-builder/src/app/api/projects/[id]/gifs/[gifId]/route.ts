import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// DELETE /api/projects/[id]/gifs/[gifId] - Remove user's GIF
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; gifId: string }> }
) {
  const { id: projectId, gifId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch GIF to verify ownership and get storage path
  const { data: gif, error: fetchError } = await supabase
    .from('user_gifs')
    .select('*')
    .eq('id', gifId)
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !gif) {
    return NextResponse.json({ error: 'GIF not found' }, { status: 404 });
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('user-gifs')
    .remove([gif.storage_path]);

  if (storageError) {
    console.error('Storage deletion error:', storageError);
    // Continue with database deletion even if storage fails
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('user_gifs')
    .delete()
    .eq('id', gifId);

  if (dbError) {
    return NextResponse.json({ error: 'Failed to delete GIF' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
