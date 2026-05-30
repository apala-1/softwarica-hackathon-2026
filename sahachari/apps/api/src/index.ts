import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env';
import { enhanceRouter } from './routes/enhance.route';
import { generateRouter } from './routes/generate.route';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '1mb' }));
// app.use(mongoSanitize());

// Routes
app.use('/enhance', enhanceRouter);
app.use('/generate', generateRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'sahachari-api' });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(Number(env.PORT), () => {
  console.log(`🚀 Sahachari API running on port ${env.PORT}`);
});

export default app;