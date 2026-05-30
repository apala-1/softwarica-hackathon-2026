const PdfPrinter = require('pdfmake/src/printer');
import { WizardFormData } from '../types/wizard.types';
import { buildNibedanTemplate } from '../templates/nibedan.template';
import { getFontDefinitions } from '../config/fonts';

export async function generateNibedanPdf(wizardData: WizardFormData): Promise<string> {
  const fonts = getFontDefinitions();
  const printer = new PdfPrinter(fonts);
  const docDefinition = buildNibedanTemplate(wizardData);

  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];

      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer.toString('base64'));
      });
      pdfDoc.on('error', reject);
      pdfDoc.end();
    } catch (err) {
      reject(err);
    }
  });
}