const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../public/img');

async function compressImages() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (err) {
    console.log('Installing "sharp" for image compression...');
    require('child_process').execSync('npm install --no-save sharp', { stdio: 'inherit' });
    sharp = require('sharp');
  }

  const files = fs.readdirSync(imgDir);
  console.log(`Found ${files.length} files in ${imgDir}\n`);

  for (const file of files) {
    const filePath = path.join(imgDir, file);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

    const sizeMB = (stat.size / (1024 * 1024)).toFixed(2);
    if (stat.size > 1000000) { // Only compress files larger than 1 MB
      console.log(`⏳ Compressing ${file} (Original: ${sizeMB} MB)...`);
      const tempPath = path.join(imgDir, `temp_${file}`);

      try {
        let pipeline = sharp(filePath);
        const metadata = await pipeline.metadata();

        // Resize if width is larger than 2400px (4K raw images)
        if (metadata.width && metadata.width > 2400) {
          pipeline = pipeline.resize({ width: 2400, fit: 'inside', withoutEnlargement: true });
        }

        let buffer;
        if (ext === '.png') {
          buffer = await pipeline
            .png({ quality: 80, compressionLevel: 9, palette: true })
            .toBuffer();
        } else {
          buffer = await pipeline
            .jpeg({ quality: 82, progressive: true, mozjpeg: true })
            .toBuffer();
        }

        fs.writeFileSync(filePath, buffer);
        const newSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);

        console.log(`✅ ${file}: ${sizeMB} MB ➔ ${newSizeMB} MB!`);
      } catch (error) {
        console.error(`❌ Failed to compress ${file}:`, error.message);
      }
    } else {
      console.log(`▶ Skipping ${file} (${sizeMB} MB - already small)`);
    }
  }

  console.log('\n🎉 Image compression completed successfully!');
}

compressImages();
