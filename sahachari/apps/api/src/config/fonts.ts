import path from 'path';
import fs from 'fs';

const fontsDir = path.resolve(__dirname, '../assets/fonts');

function loadFont(filename: string): string {
  const filePath = path.join(fontsDir, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Font file not found: ${filePath}. Place NotoSansDevanagari .ttf files in apps/api/src/assets/fonts/`);
  }
  return fs.readFileSync(filePath).toString('base64');
}

export function getFontDefinitions() {
  return {
    NotoSansDevanagari: {
      normal: Buffer.from(loadFont('NotoSansDevanagari-Regular.ttf'), 'base64'),
      bold: Buffer.from(loadFont('NotoSansDevanagari-Bold.ttf'), 'base64'),
      italics: Buffer.from(loadFont('NotoSansDevanagari-Regular.ttf'), 'base64'),
      bolditalics: Buffer.from(loadFont('NotoSansDevanagari-Bold.ttf'), 'base64'),
    },
  };
}