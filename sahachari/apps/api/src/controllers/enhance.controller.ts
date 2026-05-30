import { Request, Response, NextFunction } from 'express';
import { enhanceStoryWithGemini } from '../services/gemini.service';
import { EnhanceRequest, EnhanceResponse } from '../types/document.types';

export async function enhanceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = req.body as EnhanceRequest;
    const { enhancedStory, matchedOrganizations } = await enhanceStoryWithGemini(input);
    const response: EnhanceResponse = { enhancedStory, matchedOrganizations };
    res.json(response);
  } catch (err) {
    next(err);
  }
}