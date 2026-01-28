import { copyFileSync, mkdirSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const distDir = './dist';
const imagesDir = './images';
const distImagesDir = join(distDir, 'images');

// Create images directory in dist
mkdirSync(distImagesDir, { recursive: true });

// Copy all images
const images = readdirSync(imagesDir);
for (const image of images) {
  copyFileSync(join(imagesDir, image), join(distImagesDir, image));
}

// Generate index.html
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flink SQL & Table API - Interactive Tutorial</title>
    <meta name="description" content="Interactive demo for Apache Flink's table-stream duality - Learn Dynamic Tables and Changelog Streams">
    
    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="./images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="./images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="./images/favicon-16x16.png">
    <link rel="icon" href="./images/favicon.ico">
    
    <link rel="stylesheet" href="./index.css">
    <script type="module" src="./index.js"></script>
</head>
<body>
    <app-shell></app-shell>
</body>
</html>`;

writeFileSync(join(distDir, 'index.html'), html);

console.log('✓ Generated dist/index.html');
console.log(`✓ Copied ${images.length} images to dist/images/`);
