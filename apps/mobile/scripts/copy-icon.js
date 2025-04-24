const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '../../../packages/ui/appIcon.png');
const destination = path.resolve(__dirname, '../assets/icon.png');

fs.copyFileSync(source, destination);
console.log('✅ Copied icon from packages/ui → apps/mobile/assets');
