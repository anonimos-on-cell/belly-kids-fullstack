import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import cartRoutes from './routes/cart.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET?.trim();
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('Configure JWT_SECRET com pelo menos 32 caracteres no arquivo backend/.env.');
}

const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      callback(null, !origin || allowedOrigins.includes(origin));
    }
  })
);
app.use(express.json({ limit: '10kb' }));

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'API Ballykids em execução' });
});

app.use(((error, _req, res, next) => {
  console.error('Erro ao processar solicitação:', error);
  if (res.headersSent) {
    return next(error);
  }
  return res.status(500).json({ message: 'Erro interno ao processar a solicitação.' });
}) satisfies express.ErrorRequestHandler);

app.listen(PORT, () => {
  console.log(`Servidor a rodar em http://localhost:${PORT}`);
});
