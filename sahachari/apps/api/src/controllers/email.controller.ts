import { Request, Response, NextFunction } from 'express';
import { sendNibedanEmail } from '../services/email.service';
import { SendEmailRequest, SendEmailResponse } from '../types/document.types';

export async function emailController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = req.body as SendEmailRequest;

    await sendNibedanEmail({
      organization: input.organization,
      victimName: input.victimName,
      victimPhone: input.victimPhone,
      enhancedStory: input.enhancedStory,
      pdfBase64: input.pdfBase64,
    });

    const response: SendEmailResponse = {
      sent: true,
      to: input.organization.email,
      message: 'निवेदन सफलतापूर्वक पठाइयो।',
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
}