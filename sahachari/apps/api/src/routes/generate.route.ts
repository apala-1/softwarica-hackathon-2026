import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { generateLimiter } from '../middleware/rateLimiter';
import { generateController } from '../controllers/generate.controller';

const personSchema = z.object({
  name: z.string().min(1),
  age: z.number().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  relation: z.string().optional(),
  phone: z.string().optional(),
});

const generateSchema = z.object({
  documentType: z.literal('nibedan'),
  locale: z.literal('ne'),
  wizardData: z.object({
    safety: z.object({
      inImmediateDanger: z.boolean(),
      hasChildren: z.boolean(),
      isSafeToContact: z.boolean(),
    }),
    location: z.object({
      province: z.string().min(1),
      district: z.string().min(1),
      palika: z.string().min(1),
      ward: z.string().optional(),
    }),
    story: z.object({
      rawStory: z.string().min(1),
      enhancedStory: z.string(),
      isEnhanced: z.boolean(),
    }),
    violence: z.object({
      selectedTypes: z.array(z.string()),
    }),
    people: z.object({
      complainant: personSchema,
      accused: personSchema,
      witnesses: z.array(personSchema),
    }),
  }),
});

export const generateRouter = Router();
generateRouter.post('/', generateLimiter, validate(generateSchema), generateController);