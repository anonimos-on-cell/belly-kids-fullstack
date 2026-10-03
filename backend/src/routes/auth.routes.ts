import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const validCodes = new Map([
  ['BK-9876', { userId: 'user_01', name: 'Cliente Ballykids' }],
  ['BK-1234', { userId: 'user_02', name: 'Maria Silva' }]
]);

router.post('/login', (req: Request, res: Response) => {
  const code = typeof req.body?.code === 'string' ? req.body.code.trim().toUpperCase() : '';

  if (!code) {
    return res.status(400).json({ message: 'O código de validação é obrigatório.' });
  }

  const user = validCodes.get(code);
  if (!user) {
    return res.status(401).json({ message: 'Código de validação inválido.' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não foi configurado.');
  }

  const token = jwt.sign({ userId: user.userId }, secret, {
    algorithm: 'HS256',
    expiresIn: '7d'
  });

  return res.json({
    message: 'Login efetuado com sucesso!',
    token,
    user: { id: user.userId, name: user.name }
  });
});

export default router;
