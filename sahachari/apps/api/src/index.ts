import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env';
import { enhanceRouter } from './routes/enhance.route';
import { generateRouter } from './routes/generate.route';
import { emailRouter } from './routes/email.route';
import { errorHandler } from './middleware/errorHandler';
import { verifyEmailConnection } from './services/email.service';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '10mb' })); // bumped for pdfBase64
// app.use(mongoSanitize());

app.use((req, res, next) => {
  console.log('--- Incoming Request ---');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', req.headers['content-type']);
  console.log('Body is parsed:', req.body !== undefined);
  next();
});

app.use('/enhance', enhanceRouter);
app.use('/generate', generateRouter);
app.use('/send-email', emailRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'sahachari-api' });
});

app.use(errorHandler);

app.listen(Number(env.PORT), async () => {
  console.log(`🚀 Sahachari API running on port ${env.PORT}`);
  try {
    await verifyEmailConnection();
  } catch (err) {
    console.warn('⚠️  Email transporter failed to verify — check EMAIL_* env vars');
  }
});