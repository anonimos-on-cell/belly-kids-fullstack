import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middlewares/auth.middleware.js';
import { addCartItem, clearCart, getCart, removeCartItem } from '../database.js';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Sessão inválida ou expirada.' });
  }

  return res.json({ cart: getCart(userId) });
});

router.delete('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Sessão inválida ou expirada.' });
  }

  clearCart(userId);
  return res.json({ message: 'Sacolinha limpa.', cart: [] });
});

router.delete('/:productId', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const productId = Number(req.params.productId);
  if (!userId) {
    return res.status(401).json({ message: 'Sessão inválida ou expirada.' });
  }
  if (!Number.isSafeInteger(productId) || productId <= 0) {
    return res.status(400).json({ message: 'Identificador de produto inválido.' });
  }

  const updatedCart = removeCartItem(userId, productId);
  return res.json({ message: 'Brinquedo removido da sacolinha.', cart: updatedCart });
});

router.post('/add', authenticateToken, (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Sessão inválida ou expirada.' });
  }

  const { productId, quantity } = req.body ?? {};
  if (
    !Number.isSafeInteger(productId) ||
    productId <= 0 ||
    !Number.isSafeInteger(quantity) ||
    quantity <= 0
  ) {
    return res.status(400).json({
      message: 'O produto e a quantidade devem ser números inteiros positivos.'
    });
  }

  const cart = addCartItem(userId, productId, quantity);
  if (!cart) {
    return res.status(400).json({ message: 'A quantidade solicitada é muito alta.' });
  }

  return res.json({ message: 'Produto adicionado ao carrinho!', cart });
});

export default router;
