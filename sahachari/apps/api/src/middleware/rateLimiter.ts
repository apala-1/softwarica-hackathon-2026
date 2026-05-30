import rateLimit from 'express-rate-limit';

export const enhanceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'धेरै अनुरोधहरू। कृपया केही समय पछि पुनः प्रयास गर्नुहोस्।' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'धेरै अनुरोधहरू। कृपया केही समय पछि पुनः प्रयास गर्नुहोस्।' },
  standardHeaders: true,
  legacyHeaders: false,
});