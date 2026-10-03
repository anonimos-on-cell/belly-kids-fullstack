import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type AuthUser = { userId: string };

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Acesso negado. Inicie sessão para continuar.' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'A autenticação não está configurada no servidor.' });
  }

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      typeof decoded.userId !== 'string' ||
      !decoded.userId
    ) {
      return res.status(403).json({ message: 'Sessão inválida ou expirada.' });
    }

    req.user = { userId: decoded.userId };
    return next();
  } catch {
    return res.status(403).json({ message: 'Sessão inválida ou expirada.' });
  }
};
