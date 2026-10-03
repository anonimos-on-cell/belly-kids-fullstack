const API_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

type ApiMessage = {
  message?: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: { id: string; name: string };
};

export type CartResponse = {
  cart: Array<{ productId: number; quantity: number }>;
  message?: string;
};

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  const body: unknown = await response.json();

  if (!response.ok) {
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof (body as ApiMessage).message === 'string'
        ? (body as ApiMessage).message
        : 'A solicitação não pôde ser concluída.';

    throw new ApiError(message, response.status);
  }

  return body as T;
}

function authorizationHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export const api = {
  login(code: string): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
  },

  getCart(token: string): Promise<CartResponse> {
    return request<CartResponse>('/cart', {
      headers: authorizationHeaders(token)
    });
  },

  addToCart(productId: number, quantity: number, token: string): Promise<CartResponse> {
    return request<CartResponse>('/cart/add', {
      method: 'POST',
      headers: {
        ...authorizationHeaders(token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity })
    });
  },

  removeFromCart(productId: number, token: string): Promise<CartResponse> {
    return request<CartResponse>(`/cart/${productId}`, {
      method: 'DELETE',
      headers: authorizationHeaders(token)
    });
  },

  clearCart(token: string): Promise<CartResponse> {
    return request<CartResponse>('/cart', {
      method: 'DELETE',
      headers: authorizationHeaders(token)
    });
  }
};
