import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { enhanceLimiter } from '../middleware/rateLimiter';
import { enhanceController } from '../controllers/enhance.controller';

const enhanceSchema = z.object({
  victimName: z.string().min(1, 'निवेदिकाको नाम आवश्यक छ').max(200),
  victimPhone: z.string().max(20).optional(),

  province: z.string().min(1, 'प्रदेश आवश्यक छ'),
  district: z.string().min(1, 'जिल्ला आवश्यक छ'),
  palika: z.string().min(1, 'पालिका आवश्यक छ'),
  ward: z.string().optional(),

  accused: z.string().min(1, 'प्रतिवादीको नाम आवश्यक छ').max(200),
  relationship: z.string().min(1, 'सम्बन्ध आवश्यक छ').max(100),
  violenceTypes: z.array(z.string()).min(1, 'हिंसाको प्रकार छान्नुहोस्'),
  description: z.string().min(10, 'विवरण कम्तीमा १० अक्षर हुनुपर्छ').max(5000),
  incidentDate: z.string().min(1, 'मिति आवश्यक छ'),
  dateType: z.enum(['BS', 'AD']),
  locale: z.literal('ne'),
});

export const enhanceRouter = Router();
enhanceRouter.post('/', enhanceLimiter, validate(enhanceSchema), enhanceController);