/**
 * Bulk upload GIFs to Supabase Storage
 * 
 * Usage:
 * 1. Organize your GIFs in folders by category:
 *    my-gifs/
 *    ├── animations/
 *    ├── backgrounds/
 *    ├── buttons/
 *    └── decorations/
 * 
 * 2. Run: npx tsx scripts/bulk-upload-gifs.ts <folder-path>
 * 
 * Example:
 * npx tsx scripts/bulk-upload-gifs.ts ./my-gifs
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const BUCKET_NAME = 'retro-gifs';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const validCategories = ['animations', 'backgrounds', 'buttons', 'decorations', 'themes'];

async function uploadGif(category: string, filePath: string, fileName: string) {
  const fileBuffer = fs.readFileSync(filePath);
  const storagePath = `${category}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: 'image/gif',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload ${fileName}: ${error.message}`);
  }

  return {
    fileName,
    storagePath,
    fileSize: fileBuffer.length,
    publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`
  };
}

async function bulkUpload(folderPath: string) {
  try {
    if (!fs.existsSync(folderPath)) {
      console.error(`Folder not found: ${folderPath}`);
      process.exit(1);
    }

    const results: any[] = [];
    let successCount = 0;
    let failCount = 0;

    // Process each category folder
    for (const category of validCategories) {
      const categoryPath = path.join(folderPath, category);
      
      if (!fs.existsSync(categoryPath)) {
        console.log(`⏭️  Skipping ${category} (folder not found)`);
        continue;
      }

      const files = fs.readdirSync(categoryPath)
        .filter(file => file.toLowerCase().endsWith('.gif'));

      if (files.length === 0) {
        console.log(`⏭️  Skipping ${category} (no GIF files found)`);
        continue;
      }

      console.log(`\n📁 Processing ${category}/ (${files.length} files)...`);

      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        
        try {
          const result = await uploadGif(category, filePath, file);
          results.push({ category, ...result });
          successCount++;
          console.log(`  ✅ ${file}`);
        } catch (error: any) {
          failCount++;
          console.error(`  ❌ ${file}: ${error.message}`);
        }
      }
    }

    // Generate registry entries
    console.log('\n' + '='.repeat(60));
    console.log('📊 Upload Summary');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📦 Total: ${successCount + failCount}`);

    if (results.length > 0) {
      console.log('\n' + '='.repeat(60));
      console.log('📝 Add these entries to gifRegistry.ts:');
      console.log('='.repeat(60));
      console.log('\n');

      results.forEach(result => {
        const id = path.parse(result.fileName).name;
        const name = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const cat = result.category.slice(0, -1); // Remove 's'

        console.log(`{
  id: '${id}',
  name: '${name}',
  category: '${cat}',
  themes: ['all'], // Update with appropriate themes
  tags: [], // Add relevant tags
  path: '${result.storagePath}',
  width: 0, // Update with actual dimensions
  height: 0, // Update with actual dimensions
  fileSize: ${result.fileSize},
  description: ''
},`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.log('Usage: npx tsx scripts/bulk-upload-gifs.ts <folder-path>');
  console.log('\nFolder structure should be:');
  console.log('  folder/');
  console.log('  ├── animations/');
  console.log('  ├── backgrounds/');
  console.log('  ├── buttons/');
  console.log('  └── decorations/');
  process.exit(1);
}

const [folderPath] = args;
bulkUpload(folderPath);
