import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { generateLimiter } from '../middleware/rateLimiter';
import { emailController } from '../controllers/email.controller';

const organizationSchema = z.object({
  organization_name: z.string(),
  source_url: z.string().optional(),
  description: z.string().optional(),
  service_type: z.string(),
  contact_no: z.string().optional().default(''),
  email: z.string(),
  website: z.string().optional().default(''),
  province: z.string(),
  district: z.string(),
  local_address: z.string(),
});

const emailSchema = z.object({
  pdfBase64: z.string().min(1, 'PDF data is required'),
  enhancedStory: z.string().min(1),
  victimName: z.string().min(1),
  victimPhone: z.string().optional(),
  organization: organizationSchema,
});

export const emailRouter = Router();
emailRouter.post('/', generateLimiter, validate(emailSchema), emailController);