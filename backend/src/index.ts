import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { notFound, errorHandler } from './middleware/errorHandler';
import { ensureDevDemoReservations } from './utils/ensureDevDemoReservations';

import fieldsRouter from './routes/fields';
import usersRouter from './routes/users';
import reservationsRouter from './routes/reservations';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(limiter);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Football Field Reservation API is running',
    version: '1.0.0',
    endpoints: {
      fields: '/api/fields',
      users: '/api/users',
      reservations: '/api/reservations'
    }
  });
});

app.use('/api/fields', fieldsRouter);
app.use('/api/users', usersRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function bootstrap(): Promise<void> {
  await connectDB();

  const isProd = process.env.NODE_ENV === 'production';
  const skipDemo = process.env.DISABLE_AUTO_DEMO === 'true';
  if (!isProd && !skipDemo) {
    try {
      await ensureDevDemoReservations();
    } catch (e) {
      console.warn('[demo] Réservations auto:', (e as Error).message);
    }
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
