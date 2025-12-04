import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/projects/[id]/gifs - List user's GIFs for project
export async function GET(
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

  // Fetch user's GIFs for this project
  const { data: gifs, error } = await supabase
    .from('user_gifs')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Build CDN URLs
  const gifsWithUrls = gifs.map(gif => ({
    id: gif.id,
    name: gif.name,
    url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-gifs/${gif.storage_path}`,
    size: gif.file_size,
    createdAt: gif.created_at,
  }));

  return NextResponse.json({ gifs: gifsWithUrls });
}

// POST /api/projects/[id]/gifs - Upload new GIF
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

  // Check GIF limit (5 per project)
  const { count } = await supabase
    .from('user_gifs')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  if (count !== null && count >= 5) {
    return NextResponse.json(
      { error: 'Maximum 5 GIFs per project. Delete an existing GIF to upload a new one.' },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate file type
  if (file.type !== 'image/gif') {
    return NextResponse.json({ error: 'File must be a GIF' }, { status: 400 });
  }

  // Validate file size (1MB max)
  if (file.size > 1024 * 1024) {
    return NextResponse.json({ error: 'File size must be less than 1MB' }, { status: 400 });
  }

  // Generate storage path: user-gifs/{userId}/{projectId}/{filename}
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${user.id}/${projectId}/${timestamp}-${sanitizedName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('user-gifs')
    .upload(storagePath, file, {
      contentType: 'image/gif',
      upsert: false,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return NextResponse.json({ error: 'Failed to upload GIF' }, { status: 500 });
  }

  // Save metadata to database
  const { data: gifRecord, error: dbError } = await supabase
    .from('user_gifs')
    .insert({
      project_id: projectId,
      user_id: user.id,
      name: file.name,
      storage_path: storagePath,
      file_size: file.size,
    })
    .select()
    .single();

  if (dbError) {
    // Cleanup storage if database insert fails
    await supabase.storage.from('user-gifs').remove([storagePath]);
    return NextResponse.json({ error: 'Failed to save GIF metadata' }, { status: 500 });
  }

  const gifUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-gifs/${storagePath}`;

  return NextResponse.json({
    gif: {
      id: gifRecord.id,
      name: gifRecord.name,
      url: gifUrl,
      size: gifRecord.file_size,
      createdAt: gifRecord.created_at,
    },
  });
}

// DELETE /api/projects/[id]/gifs/[gifId] - handled in separate route
