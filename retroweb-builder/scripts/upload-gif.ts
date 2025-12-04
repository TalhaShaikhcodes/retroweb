/**
 * Script to upload GIFs to Supabase Storage
 * 
 * Usage:
 * 1. Place your GIF files in a local folder
 * 2. Run: npx tsx scripts/upload-gif.ts <category> <file-path>
 * 
 * Example:
 * npx tsx scripts/upload-gif.ts animations ./my-gifs/construction.gif
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const BUCKET_NAME = 'retro-gifs';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadGif(category: string, filePath: string) {
  try {
    // Validate category
    const validCategories = ['animations', 'backgrounds', 'buttons', 'decorations', 'themes'];
    if (!validCategories.includes(category)) {
      console.error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
      process.exit(1);
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const storagePath = `${category}/${fileName}`;

    console.log(`Uploading ${fileName} to ${storagePath}...`);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: 'image/gif',
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error('Upload failed:', error.message);
      process.exit(1);
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;
    
    console.log('✅ Upload successful!');
    console.log('📁 Storage path:', storagePath);
    console.log('🌐 Public URL:', publicUrl);
    console.log('\nAdd this to gifRegistry.ts:');
    console.log(`{
  id: '${path.parse(fileName).name}',
  name: '${path.parse(fileName).name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}',
  category: '${category.slice(0, -1)}', // Remove 's' from category
  themes: ['all'], // Update with appropriate themes
  tags: [], // Add relevant tags
  path: '${storagePath}',
  width: 0, // Update with actual dimensions
  height: 0, // Update with actual dimensions
  fileSize: ${fileBuffer.length},
  description: ''
},`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: npx tsx scripts/upload-gif.ts <category> <file-path>');
  console.log('Categories: animations, backgrounds, buttons, decorations, themes');
  console.log('Example: npx tsx scripts/upload-gif.ts animations ./construction.gif');
  process.exit(1);
}

const [category, filePath] = args;
uploadGif(category, filePath);
