import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type CartItem = { productId: number; quantity: number };

const databasePath = resolve(dirname(fileURLToPath(import.meta.url)), '../data/ballykids.sqlite');
const configuredDatabasePath = process.env.DATABASE_PATH?.trim();
const resolvedDatabasePath = configuredDatabasePath ? resolve(configuredDatabasePath) : databasePath;
mkdirSync(dirname(resolvedDatabasePath), { recursive: true });

const database = new Database(resolvedDatabasePath);
database.pragma('journal_mode = WAL');
database.pragma('foreign_keys = ON');
database.exec(`
  CREATE TABLE IF NOT EXISTS cart_items (
    user_id TEXT NOT NULL,
    product_id INTEGER NOT NULL CHECK (product_id > 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (user_id, product_id)
  )
`);

const selectCart = database.prepare(`
  SELECT product_id AS productId, quantity
  FROM cart_items
  WHERE user_id = ?
  ORDER BY rowid
`);
const selectCartItem = database.prepare(`
  SELECT quantity
  FROM cart_items
  WHERE user_id = ? AND product_id = ?
`);
const upsertCartItem = database.prepare(`
  INSERT INTO cart_items (user_id, product_id, quantity)
  VALUES (?, ?, ?)
  ON CONFLICT (user_id, product_id)
  DO UPDATE SET quantity = quantity + excluded.quantity
`);
const deleteCartItem = database.prepare(`
  DELETE FROM cart_items
  WHERE user_id = ? AND product_id = ?
`);
const deleteCart = database.prepare(`
  DELETE FROM cart_items
  WHERE user_id = ?
`);

const addItemTransaction = database.transaction(
  (userId: string, productId: number, quantity: number): CartItem[] | null => {
    const existing = selectCartItem.get(userId, productId) as { quantity: number } | undefined;
    if (existing && !Number.isSafeInteger(existing.quantity + quantity)) {
      return null;
    }

    upsertCartItem.run(userId, productId, quantity);
    return selectCart.all(userId) as CartItem[];
  }
);

export function getCart(userId: string): CartItem[] {
  return selectCart.all(userId) as CartItem[];
}

export function addCartItem(
  userId: string,
  productId: number,
  quantity: number
): CartItem[] | null {
  return addItemTransaction(userId, productId, quantity);
}

export function removeCartItem(userId: string, productId: number): CartItem[] {
  deleteCartItem.run(userId, productId);
  return getCart(userId);
}

export function clearCart(userId: string): void {
  deleteCart.run(userId);
}
