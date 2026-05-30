import { Request, Response, NextFunction } from 'express';
import { generateNibedanPdf } from '../services/pdf.service';
import { GenerateRequest, GenerateResponse } from '../types/document.types';
import crypto from 'crypto';

export async function generateController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { wizardData } = req.body as GenerateRequest;
    const pdfBase64 = await generateNibedanPdf(wizardData);
    const sessionId = crypto.randomUUID();
    const response: GenerateResponse = { pdfBase64, sessionId };
    res.json(response);
  } catch (err) {
    next(err);
  }
}