const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = 'c:/Users/HP/Desktop/bazaarstyle/public';
const filesToConvert = [
    'bg1.png',
    'bg2.png',
    'club.png',
    'log.png',
    's1.png',
    's2.png',
    'sign.png'
];

async function optimize() {
    console.log('Starting image optimization...');
    for (const file of filesToConvert) {
        const inputPath = path.join(publicDir, file);
        const outputPath = path.join(publicDir, file.replace('.png', '.webp'));
        
        try {
            if (fs.existsSync(inputPath)) {
                console.log(`Optimizing ${file}...`);
                await sharp(inputPath)
                    .webp({ quality: 85 })
                    .toFile(outputPath);
                
                const oldSize = fs.statSync(inputPath).size / 1024 / 1024;
                const newSize = fs.statSync(outputPath).size / 1024 / 1024;
                console.log(`Done! ${file}: ${oldSize.toFixed(2)}MB -> ${newSize.toFixed(2)}MB`);
            } else {
                console.warn(`File not found: ${inputPath}`);
            }
        } catch (err) {
            console.error(`Error optimizing ${file}:`, err);
        }
    }
    console.log('Optimization complete.');
}

optimize();
