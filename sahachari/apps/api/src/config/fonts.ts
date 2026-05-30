import path from 'path';
import fs from 'fs';

const fontsDir = path.resolve(__dirname, '../assets/fonts');

export function getFontDefinitions() {
  const regular = path.join(fontsDir, 'NotoSansDevanagari-Regular.ttf');
  const bold = path.join(fontsDir, 'NotoSansDevanagari-Bold.ttf');

  // Verify files exist at startup
  if (!fs.existsSync(regular)) throw new Error(`Font not found: ${regular}`);
  if (!fs.existsSync(bold)) throw new Error(`Font not found: ${bold}`);

  return {
    NotoSansDevanagari: {
      normal: regular,
      bold: bold,
      italics: regular,
      bolditalics: bold,
    },
  };
}