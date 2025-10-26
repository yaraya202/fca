const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const zipPath = path.join(__dirname, 'kashif-raza-fca.zip');
const targetPath = path.join(__dirname, 'temp_kashif_fca');

// Remove old directory if exists
if (fs.existsSync(targetPath)) {
  fs.rmSync(targetPath, { recursive: true, force: true });
}
fs.mkdirSync(targetPath, { recursive: true });

// Extract
console.log('Extracting kashif-raza-fca.zip...');
const zip = new AdmZip(zipPath);
zip.extractAllTo(targetPath, true);

console.log('Extraction complete!');

// List top-level contents
const files = fs.readdirSync(targetPath);
console.log('Extracted contents:', files.join(', '));

// Show structure
function showStructure(dir, prefix = '') {
  const items = fs.readdirSync(dir);
  items.forEach((item, index) => {
    const fullPath = path.join(dir, item);
    const isLast = index === items.length - 1;
    const stat = fs.statSync(fullPath);
    console.log(`${prefix}${isLast ? '└─' : '├─'} ${item}${stat.isDirectory() ? '/' : ''}`);
  });
}

console.log('\nDirectory structure:');
showStructure(targetPath);

