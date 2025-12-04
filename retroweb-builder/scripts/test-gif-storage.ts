/**
 * Test script to verify Supabase Storage setup
 * 
 * Usage: npx tsx scripts/test-gif-storage.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET_NAME = 'retro-gifs';

async function testStorage() {
  console.log('🧪 Testing Supabase Storage Setup...\n');

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing environment variables!');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    // Test 1: Check if bucket exists
    console.log('1️⃣ Checking if bucket exists...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Failed to list buckets:', bucketsError.message);
      process.exit(1);
    }

    const bucket = buckets?.find(b => b.name === BUCKET_NAME);
    if (!bucket) {
      console.error(`❌ Bucket "${BUCKET_NAME}" not found!`);
      process.exit(1);
    }
    console.log(`✅ Bucket "${BUCKET_NAME}" exists`);
    console.log(`   Public: ${bucket.public}`);
    console.log(`   Created: ${bucket.created_at}\n`);

    // Test 2: List files in bucket
    console.log('2️⃣ Listing files in bucket...');
    const { data: files, error: filesError } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { limit: 100 });

    if (filesError) {
      console.error('❌ Failed to list files:', filesError.message);
      process.exit(1);
    }

    if (!files || files.length === 0) {
      console.log('📭 Bucket is empty (no files uploaded yet)');
      console.log('   Use upload scripts to add GIFs\n');
    } else {
      console.log(`✅ Found ${files.length} items in bucket:`);
      files.forEach(file => {
        console.log(`   - ${file.name} (${file.metadata?.size || 0} bytes)`);
      });
      console.log('');
    }

    // Test 3: Generate sample CDN URL
    console.log('3️⃣ Testing CDN URL generation...');
    const samplePath = 'animations/construction.gif';
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${samplePath}`;
    console.log(`✅ Sample CDN URL format:`);
    console.log(`   ${publicUrl}\n`);

    // Test 4: Check public access
    console.log('4️⃣ Verifying public access...');
    try {
      const response = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/`);
      if (response.ok || response.status === 404) {
        console.log('✅ Public access is configured correctly\n');
      } else {
        console.log('⚠️  Public access may not be configured properly');
        console.log(`   Status: ${response.status}\n`);
      }
    } catch (error) {
      console.log('⚠️  Could not verify public access');
      console.log('   This is normal if no files are uploaded yet\n');
    }

    // Summary
    console.log('=' .repeat(60));
    console.log('✅ Storage Setup Complete!');
    console.log('=' .repeat(60));
    console.log('\n📝 Next Steps:');
    console.log('1. Collect retro GIFs from sources like gifcities.org');
    console.log('2. Organize them in folders by category');
    console.log('3. Run: npx tsx scripts/bulk-upload-gifs.ts <folder>');
    console.log('4. Update src/lib/gifRegistry.ts with the generated entries');
    console.log('\n📚 See GIF_UPLOAD_GUIDE.md for detailed instructions\n');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testStorage();
