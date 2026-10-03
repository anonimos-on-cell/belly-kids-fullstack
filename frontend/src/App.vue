<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ApiError, api, type CartResponse } from './services/api';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  emoji: string;
  image: string;
  color: string;
  colorName: string;
};

type CartItem = { productId: number; quantity: number };
type Page = 'store' | 'cart' | 'checkout' | 'complete';
type PaymentMethod = 'pix-demo' | 'delivery-demo';

const products: Product[] = [
  {
    id: 1,
    name: 'Kit Bolsa Maternidade',
    description: 'Praticidade e carinho para acompanhar os passeios com o bebê.',
    price: 159.9,
    emoji: '👜',
    image: 'https://i.pinimg.com/736x/27/cb/30/27cb30dc0c0e3689757ba730b1e803df.jpg',
    color: 'peach',
    colorName: 'Rosa Bebê'
  },
  {
    id: 2,
    name: 'Mordedor de Silicone',
    description: 'Um mordedor macio em tom suave para os primeiros dentinhos.',
    price: 29.9,
    emoji: '🧸',
    image: 'https://rihappy.vtexassets.com/arquivos/ids/340519-800-auto?v=636432438318900000&width=800&height=auto&aspect=true',
    color: 'mint',
    colorName: 'Azul Pastel'
  },
  {
    id: 3,
    name: 'Manta Soft Antialérgica',
    description: 'Manta macia para aconchegar o bebê nos momentos de descanso.',
    price: 89.9,
    emoji: '☁️',
    image: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-m6ph12rqb87bf7',
    color: 'lilac',
    colorName: 'Nuvem Mágica'
  },
  {
    id: 4,
    name: 'Prendedor de Chupeta',
    description: 'Um acessório colorido para manter a chupeta sempre por perto.',
    price: 19.5,
    emoji: '🌈',
    image: 'https://s.brascol.com.br/product/2025/processados/1339187_1.jpg',
    color: 'yellow',
    colorName: 'Colorê'
  },
  {
    id: 5,
    name: 'Naninha de Carneirinho',
    description: 'Uma naninha fofinha para acompanhar o soninho do bebê.',
    price: 45.9,
    emoji: '🐑',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnYHfLgAZdwNlHfCcT7t2d8ZbDRf4CUle_otWsshAgBkHAZ4Yjk2Op6Ck&s=10',
    color: 'blue',
    colorName: 'Branca Neve'
  },
  {
    id: 6,
    name: 'Chocalho Sensorial',
    description: 'Cores, sons e texturas para estimular novas descobertas.',
    price: 19.5,
    emoji: '🎵',
    image: 'https://drogariasp.vteximg.com.br/arquivos/ids/1181392-1000-1000/image-4ebbcd9b6b7b46adb35398c013d6015f.jpg?v=638678711342800000',
    color: 'pink',
    colorName: 'Colorê'
  },
  {
    id: 7,
    name: 'Babador Bandana',
    description: 'Conforto e charme para acompanhar as refeições do bebê.',
    price: 19.5,
    emoji: '👶',
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_759197-MLA113098054039_062026-F.webp',
    color: 'peach',
    colorName: 'Colorê'
  },
  {
    id: 8,
    name: 'Meias Antiderrapantes',
    description: 'Meias confortáveis para os pequenos passinhos em segurança.',
    price: 19.5,
    emoji: '🧦',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400',
    color: 'mint',
    colorName: 'Colorê'
  },
  {
    id: 9,
    name: 'Toalha com Capuz',
    description: 'Uma toalha macia para deixar a hora do banho mais gostosa.',
    price: 19.5,
    emoji: '🛁',
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_624764-MLA113050758603_062026-F.webp',
    color: 'lilac',
    colorName: 'Colorê'
  },
  {
    id: 10,
    name: 'Escova para Mamadeira',
    description: 'Praticidade para a limpeza diária das mamadeiras.',
    price: 19.5,
    emoji: '🍼',
    image: 'https://product-data.raiadrogasil.io/images/3708289.webp',
    color: 'yellow',
    colorName: 'Colorê'
  },
  {
    id: 11,
    name: 'Kit Pente e Escova',
    description: 'Um cuidado delicado para os cabelinhos do bebê.',
    price: 19.5,
    emoji: '🪮',
    image: 'https://cdn.awsli.com.br/757/757427/produto/157622158e975b01244.jpg',
    color: 'blue',
    colorName: 'Colorê'
  },
  {
    id: 12,
    name: 'Porta-Chupeta',
    description: 'Um estojo prático para guardar a chupeta nos passeios.',
    price: 19.5,
    emoji: '🧸',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4o052aTtfx7VrS6m8EafNFkhdEG8hd8tyJaeHGcn6TQ&s=10',
    color: 'pink',
    colorName: 'Colorê'
  }
];

function hideBrokenImage(event: Event) {
  if (event.currentTarget instanceof HTMLImageElement) {
    event.currentTarget.hidden = true;
    event.currentTarget.parentElement?.classList.add('image-fallback');
  }
}

const code = ref('');
const token = ref(localStorage.getItem('ballykids_token') ?? '');
const customerName = ref('');
const status = ref('');
const statusKind = ref<'success' | 'error'>('success');
const cart = ref<CartItem[]>([]);
const page = ref<Page>('store');
const paymentMethod = ref<PaymentMethod>('pix-demo');
const loading = ref(false);
const updatingCart = ref(false);

const isLoggedIn = computed(() => Boolean(token.value));
const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));
const cartItems = computed(() =>
  cart.value
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.productId)
    }))
    .filter((item): item is CartItem & { product: Product } => Boolean(item.product))
);
const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
);
const shipping = computed(() => (subtotal.value >= 150 || subtotal.value === 0 ? 0 : 12.9));
const total = computed(() => subtotal.value + shipping.value);
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function showStatus(message: string, kind: 'success' | 'error' = 'success') {
  status.value = message;
  statusKind.value = kind;
}

async function handleLogin() {
  if (!code.value.trim()) {
    showStatus('Digite seu código mágico para continuar.', 'error');
    return;
  }

  loading.value = true;
  status.value = '';
  try {
    const response = await api.login(code.value.trim());
    token.value = response.token;
    customerName.value = response.user.name;
    localStorage.setItem('ballykids_token', response.token);
    await loadCart();
    showStatus(`Que bom ter você aqui, ${response.user.name}!`);
  } catch (error) {
    showStatus(error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.', 'error');
  } finally {
    loading.value = false;
  }
}

async function loadCart() {
  if (!token.value) {
    cart.value = [];
    return;
  }
  const response = await api.getCart(token.value);
  cart.value = response.cart;
}

async function updateCart(action: () => Promise<CartResponse>, successMessage: string) {
  if (!isLoggedIn.value) {
    showStatus('Entre com seu código para guardar os brinquedos na sacolinha.', 'error');
    return false;
  }

  updatingCart.value = true;
  try {
    const response = await action();
    cart.value = response.cart;
    showStatus(response.message ?? successMessage);
    return true;
  } catch (error) {
    showStatus(error instanceof Error ? error.message : 'Não foi possível atualizar a sacolinha.', 'error');
    return false;
  } finally {
    updatingCart.value = false;
  }
}

async function addToCart(product: Product) {
  await updateCart(() => api.addToCart(product.id, 1, token.value), `${product.name} foi para a sacolinha!`);
}

async function removeFromCart(productId: number) {
  await updateCart(() => api.removeFromCart(productId, token.value), 'Brinquedo removido da sacolinha.');
}

function openCart() {
  if (!isLoggedIn.value) {
    showStatus('Entre com seu código para acessar sua sacolinha.', 'error');
    return;
  }
  page.value = 'cart';
  status.value = '';
}

function startCheckout() {
  if (cartItems.value.length === 0) {
    showStatus('Sua sacolinha está vazia. Escolha um brinquedo primeiro.', 'error');
    page.value = 'store';
    return;
  }
  page.value = 'checkout';
  status.value = '';
}

async function completeDemoOrder() {
  if (!isLoggedIn.value || cartItems.value.length === 0) {
    showStatus('Entre e adicione um produto antes de continuar.', 'error');
    return;
  }

  const cleared = await updateCart(() => api.clearCart(token.value), 'Pedido demonstrativo concluído.');
  if (cleared) {
    page.value = 'complete';
    status.value = '';
  }
}

function clearSession() {
  token.value = '';
  customerName.value = '';
  cart.value = [];
  localStorage.removeItem('ballykids_token');
  page.value = 'store';
}

function handleLogout() {
  clearSession();
  showStatus('Até logo! Esperamos ver você de novo em breve.');
}

async function loadInitialCart() {
  if (!token.value) return;
  try {
    await loadCart();
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      clearSession();
      showStatus('Sua sessão expirou. Entre novamente para continuar.', 'error');
    } else {
      showStatus(error instanceof Error ? error.message : 'Não foi possível carregar sua sacolinha.', 'error');
    }
  }
}

onMounted(loadInitialCart);
</script>

<template>
  <main class="storefront">
    <div class="announcement">
      <span aria-hidden="true">✨</span>
      Um montão de diversão esperando por você!
      <span aria-hidden="true">✨</span>
    </div>

    <header class="site-header">
      <a class="brand" href="#" aria-label="Ballykids início" @click.prevent="page = 'store'">
        <span class="brand-icon" aria-hidden="true">🧸</span>
        <span>Bally<span>kids</span></span>
      </a>

      <nav class="main-nav" aria-label="Navegação principal">
        <button class="nav-link" :class="{ active: page === 'store' }" @click="page = 'store'">
          Brinquedos
        </button>
        <button class="nav-link" :class="{ active: page === 'cart' }" @click="openCart">
          Sacolinha <span class="cart-count">{{ cartCount }}</span>
        </button>
      </nav>

      <div class="account-actions">
        <span v-if="isLoggedIn" class="welcome-name">Oi, {{ customerName || 'amigo(a)' }}!</span>
        <button v-if="isLoggedIn" class="account-button" @click="handleLogout">Sair</button>
        <button v-else class="account-button" @click="showStatus('Use o campo de código mágico abaixo para entrar.', 'error')">
          Minha conta
        </button>
      </div>
    </header>

    <section class="hero">
      <div class="hero-copy">
        <span class="hero-kicker">Pequenas alegrias, grandes aventuras</span>
        <h1>Brincar faz o mundo <span>mais colorido!</span></h1>
        <p>Encontre presentes e brinquedos escolhidos com carinho para acompanhar cada descoberta.</p>
        <button class="hero-button" @click="page = 'store'">Explorar brinquedos <span aria-hidden="true">→</span></button>
        <div class="hero-promise">
          <span aria-hidden="true">🌼</span> Um carinho em cada escolha
        </div>
      </div>
      <div class="hero-art" aria-label="Ilustração de brinquedos">
        <div class="sun-shape"></div>
        <span class="hero-toy toy-bear" aria-hidden="true">🧸</span>
        <span class="hero-toy toy-blocks" aria-hidden="true">🧱</span>
        <span class="hero-toy toy-balloon" aria-hidden="true">🎈</span>
        <span class="hero-star star-one" aria-hidden="true">✦</span>
        <span class="hero-star star-two" aria-hidden="true">✿</span>
      </div>
    </section>

    <section class="shop-area">
      <div class="shop-heading">
        <div>
          <span class="section-kicker">Escolhidos com carinho</span>
          <h2>{{ page === 'store' ? 'Um brinquedo para cada aventura' : page === 'cart' ? 'Sua sacolinha feliz' : page === 'checkout' ? 'Revisar seu pedido' : 'Pedido de demonstração' }}</h2>
        </div>
        <button v-if="page !== 'store'" class="back-link" @click="page = 'store'">← Voltar à loja</button>
      </div>

      <div v-if="status" class="status-box" :class="{ success: statusKind === 'success' }" role="status">
        {{ status }}
      </div>

      <div v-if="!isLoggedIn && page === 'store'" class="login-strip">
        <div class="login-copy">
          <span class="login-mascot" aria-hidden="true">🔑</span>
          <div><strong>Entre para guardar seus favoritos</strong><p>Digite seu código mágico e sua sacolinha fica pertinho.</p></div>
        </div>
        <form class="login-form" @submit.prevent="handleLogin">
          <label class="visually-hidden" for="customer-code">Código mágico</label>
          <input id="customer-code" v-model="code" placeholder="Ex.: BK-9876" maxlength="10" autocomplete="one-time-code" />
          <button :disabled="loading">{{ loading ? 'Entrando…' : 'Entrar' }}</button>
        </form>
      </div>

      <section v-if="page === 'store'" class="product-grid" aria-label="Catálogo de brinquedos">
        <article v-for="product in products" :key="product.id" class="product-card">
          <div class="product-art" :class="product.color">
            <span class="product-tag">{{ product.colorName }}</span>
            <span class="product-fallback" aria-hidden="true">{{ product.emoji }}</span>
            <img
              class="product-image"
              :src="product.image"
              :alt="product.name"
              loading="lazy"
              @error="hideBrokenImage"
            />
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <div class="product-buy-row">
              <strong class="price">{{ currency.format(product.price) }}</strong>
              <button :disabled="updatingCart" :aria-label="`Adicionar ${product.name} à sacolinha`" @click="addToCart(product)">
                {{ updatingCart ? '…' : 'Quero!' }}
              </button>
            </div>
          </div>
        </article>
      </section>

      <div v-else-if="page === 'cart' || page === 'checkout'" class="checkout-layout">
        <section class="cart-list">
          <div v-if="!isLoggedIn" class="empty-state">
            <span aria-hidden="true">🔐</span>
            <h3>Entre para ver sua sacolinha</h3>
            <p>Sua conta guarda os brinquedos escolhidos durante esta visita.</p>
          </div>
          <div v-else-if="cartItems.length === 0" class="empty-state">
            <span aria-hidden="true">🧺</span>
            <h3>Sua sacolinha está esperando!</h3>
            <p>Volte para a loja e escolha uma nova aventura.</p>
            <button @click="page = 'store'">Ver brinquedos</button>
          </div>
          <article v-for="item in cartItems" :key="item.productId" class="cart-item">
            <div class="cart-item-art" :class="item.product.color">
              <span class="cart-fallback" aria-hidden="true">{{ item.product.emoji }}</span>
              <img
                :src="item.product.image"
                :alt="item.product.name"
                loading="lazy"
                @error="hideBrokenImage"
              />
            </div>
            <div class="cart-item-info">
              <h3>{{ item.product.name }}</h3>
              <p>{{ currency.format(item.product.price) }} cada</p>
              <span class="item-quantity">Quantidade: {{ item.quantity }}</span>
            </div>
            <strong class="item-total">{{ currency.format(item.product.price * item.quantity) }}</strong>
            <button class="remove-button" :disabled="updatingCart" :aria-label="`Remover ${item.product.name}`" @click="removeFromCart(item.productId)">Remover</button>
          </article>
        </section>

        <aside v-if="cartItems.length" class="order-card">
          <h3>Resumo da sacolinha</h3>
          <div class="summary-row"><span>Produtos</span><span>{{ currency.format(subtotal) }}</span></div>
          <div class="summary-row"><span>Entrega</span><span>{{ shipping === 0 ? 'Grátis' : currency.format(shipping) }}</span></div>
          <div v-if="subtotal < 150" class="shipping-hint">Faltam {{ currency.format(150 - subtotal) }} para ganhar entrega grátis!</div>
          <div class="summary-total"><span>Total</span><strong>{{ currency.format(total) }}</strong></div>
          <button v-if="page === 'cart'" class="primary-button" @click="startCheckout">Continuar para pagamento</button>
          <div v-else class="payment-choice">
            <h4>Forma de pagamento demonstrativa</h4>
            <label class="payment-option">
              <input v-model="paymentMethod" type="radio" value="pix-demo" />
              <span class="payment-symbol" aria-hidden="true">▦</span>
              <span><strong>Pix de demonstração</strong><small>Não gera cobrança nem QR code</small></span>
            </label>
            <label class="payment-option">
              <input v-model="paymentMethod" type="radio" value="delivery-demo" />
              <span class="payment-symbol" aria-hidden="true">🚚</span>
              <span><strong>Pagamento na entrega (teste)</strong><small>Opção apenas ilustrativa</small></span>
            </label>
            <div class="demo-warning">
              <strong>Checkout de demonstração</strong>
              <p>Nenhum pagamento real será processado. Não informe dados de cartão, senha ou conta bancária.</p>
            </div>
            <button class="primary-button" :disabled="updatingCart" @click="completeDemoOrder">
              {{ updatingCart ? 'Finalizando…' : 'Finalizar pedido de teste' }}
            </button>
          </div>
          <p class="secure-note"><span aria-hidden="true">🔒</span> Seus dados de pagamento não são solicitados nem armazenados nesta demonstração.</p>
        </aside>
      </div>

      <section v-else class="order-complete">
        <span class="complete-icon" aria-hidden="true">🎉</span>
        <span class="section-kicker">Tudo certo por aqui</span>
        <h3>Seu pedido de teste foi concluído!</h3>
        <p>Esta é uma confirmação visual. Não houve cobrança, pagamento ou envio real.</p>
        <div class="secure-note"><span aria-hidden="true">🔒</span> Para vender de verdade, esta etapa precisa ser conectada a um provedor de pagamento seguro.</div>
        <button class="primary-button" @click="page = 'store'">Continuar passeando</button>
      </section>
    </section>

    <section class="trust-strip" aria-label="Informações de segurança">
      <div><span aria-hidden="true">💛</span><strong>Escolhas com carinho</strong><small>Uma loja feita para brincar</small></div>
      <div><span aria-hidden="true">🔒</span><strong>Pagamento protegido</strong><small>Na loja real, via provedor seguro</small></div>
      <div><span aria-hidden="true">🌱</span><strong>Mais imaginação</strong><small>Momentos felizes em família</small></div>
    </section>

    <footer class="site-footer">
      <a class="brand footer-brand" href="#" @click.prevent="page = 'store'"><span class="brand-icon" aria-hidden="true">🧸</span><span>Bally<span>kids</span></span></a>
      <p>Feito com carinho para grandes imaginações. <span aria-hidden="true">💛</span></p>
      <small>Loja demonstrativa · Os pagamentos não são processados.</small>
    </footer>
  </main>
</template>

<style>
:root {
  font-family: 'Trebuchet MS', Arial, sans-serif;
  color: #4d3d5e;
  background: #fffaf1;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  font-optical-sizing: auto;
}

* { box-sizing: border-box; }
body { min-width: 320px; margin: 0; }
button, input { font: inherit; }
button { cursor: pointer; }
button:focus-visible, a:focus-visible, input:focus-visible {
  outline: 3px solid #669fdf;
  outline-offset: 3px;
}
button:disabled { cursor: not-allowed; opacity: 0.65; }

.storefront { min-height: 100vh; background: #fffaf1; }
.announcement {
  padding: 9px 16px;
  background: #6b527d;
  color: #fff9dc;
  text-align: center;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.announcement span { margin: 0 7px; color: #ffe38f; }
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: min(1160px, calc(100% - 48px));
  min-height: 82px;
  margin: auto;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #5c496e;
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: -0.06em;
  text-decoration: none;
}
.brand > span:last-child > span { color: #ee7899; }
.brand-icon { font-size: 1.75rem; }
.main-nav, .account-actions { display: flex; align-items: center; gap: 24px; }
.nav-link, .account-button, .back-link {
  border: 0;
  background: transparent;
  color: #70647a;
  font-weight: 700;
}
.nav-link { padding: 10px 2px; }
.nav-link.active { color: #e66d8e; }
.cart-count {
  display: inline-grid;
  min-width: 22px;
  height: 22px;
  margin-left: 4px;
  place-items: center;
  border-radius: 50%;
  background: #ffe4ad;
  color: #74552a;
  font-size: 0.75rem;
}
.welcome-name { color: #6f6379; font-size: 0.9rem; }
.account-button {
  border: 2px solid #e9dff0;
  border-radius: 999px;
  padding: 9px 17px;
  color: #665477;
}
.hero {
  display: grid;
  grid-template-columns: 1.03fr 0.97fr;
  align-items: center;
  gap: 36px;
  width: min(1160px, calc(100% - 48px));
  min-height: 365px;
  margin: 0 auto 44px;
  padding: 36px 62px;
  overflow: hidden;
  border-radius: 32px;
  background: #f9e9d6;
}
.hero-copy { position: relative; z-index: 1; }
.hero-kicker, .section-kicker {
  color: #5a9a83;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.hero h1 {
  max-width: 520px;
  margin: 13px 0;
  color: #544366;
  font-size: clamp(2.4rem, 5vw, 4.1rem);
  letter-spacing: -0.055em;
  line-height: 1.04;
}
.hero h1 span { color: #e87997; }
.hero-copy > p { max-width: 430px; margin: 0; color: #746b78; line-height: 1.65; }
.hero-button, .primary-button {
  border: 0;
  border-radius: 14px;
  background: #e97896;
  box-shadow: 0 4px 0 #ce5f7e;
  color: white;
  font-weight: 800;
  transition: transform 0.15s ease;
}
.hero-button { margin-top: 22px; padding: 13px 19px; }
.hero-button:hover, .primary-button:hover { transform: translateY(-2px); }
.hero-promise { margin-top: 19px; color: #817583; font-size: 0.83rem; font-weight: 700; }
.hero-promise span { margin-right: 5px; }
.hero-art { position: relative; display: grid; min-height: 285px; place-items: center; }
.sun-shape {
  position: absolute;
  width: min(285px, 80%);
  aspect-ratio: 1;
  border-radius: 45% 55% 52% 48%;
  background: #ffdb82;
  transform: rotate(-8deg);
}
.hero-toy { position: absolute; filter: drop-shadow(0 10px 7px rgb(110 75 74 / 15%)); }
.toy-bear { z-index: 1; font-size: clamp(7rem, 16vw, 11rem); transform: rotate(-8deg); }
.toy-blocks { right: 4%; bottom: 4%; font-size: 4rem; transform: rotate(10deg); }
.toy-balloon { top: 4%; left: 12%; font-size: 3.7rem; transform: rotate(-12deg); }
.hero-star { position: absolute; color: #e87897; font-size: 2.2rem; }
.star-one { top: 14%; right: 14%; }
.star-two { bottom: 18%; left: 3%; color: #68ad95; }
.shop-area { width: min(1160px, calc(100% - 48px)); margin: 0 auto; }
.shop-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
.shop-heading h2 { margin: 7px 0 0; color: #554467; font-size: clamp(1.6rem, 3vw, 2rem); letter-spacing: -0.04em; }
.back-link { padding: 8px 0; color: #e16f8e; }
.status-box {
  margin: 0 0 20px;
  border: 2px solid #f1b6ad;
  border-radius: 14px;
  background: #fff1ee;
  padding: 12px 16px;
  color: #994d4b;
}
.status-box.success { border-color: #a9dfc8; background: #edfff5; color: #34745b; }
.login-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  margin-bottom: 25px;
  border: 2px solid #f2e2b7;
  border-radius: 20px;
  background: #fff7df;
  padding: 17px 20px;
}
.login-copy { display: flex; align-items: center; gap: 13px; }
.login-mascot { font-size: 1.9rem; }
.login-copy strong { color: #665273; }
.login-copy p { margin: 4px 0 0; color: #867b87; font-size: 0.83rem; }
.login-form { display: flex; gap: 8px; }
.login-form input {
  width: 150px;
  min-width: 0;
  border: 2px solid #e8deed;
  border-radius: 12px;
  background: #fff;
  padding: 10px 12px;
}
.login-form button {
  border: 0;
  border-radius: 12px;
  background: #6ba991;
  padding: 10px 17px;
  color: white;
  font-weight: 800;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}
.product-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
.product-card {
  overflow: hidden;
  border: 1px solid #f0e7db;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 5px 18px rgb(95 69 88 / 5%);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 25px rgb(95 69 88 / 10%); }
.product-art { position: relative; display: grid; min-height: 220px; place-items: center; overflow: hidden; }
.product-art.peach, .cart-item-art.peach { background: #fde0d3; }
.product-art.mint, .cart-item-art.mint { background: #d7f0df; }
.product-art.lilac, .cart-item-art.lilac { background: #e9def4; }
.product-art.yellow, .cart-item-art.yellow { background: #ffefbd; }
.product-art.blue, .cart-item-art.blue { background: #d9ebf8; }
.product-art.pink, .cart-item-art.pink { background: #f9dce8; }
.product-tag { position: absolute; top: 13px; left: 13px; border-radius: 999px; background: rgb(255 255 255 / 86%); padding: 6px 10px; color: #76677d; font-size: 0.7rem; font-weight: 800; }
.product-fallback, .cart-fallback { display: none; }
.product-art.image-fallback .product-fallback { display: block; font-size: 6rem; }
.product-image { position: absolute; inset: 0; width: 100%; height: 100%; padding: 12px; object-fit: contain; }
.product-image[hidden] { display: none; }
.product-info { padding: 17px 18px 19px; }
.product-info h3, .cart-item-info h3 { margin: 0; color: #554667; font-size: 1.05rem; }
.product-info > p { min-height: 42px; margin: 7px 0 14px; color: #817785; font-size: 0.84rem; line-height: 1.5; }
.product-buy-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.price { color: #635172; font-size: 1.1rem; }
.product-buy-row button {
  border: 0;
  border-radius: 11px;
  background: #a8dac7;
  box-shadow: 0 3px 0 #7fbaa4;
  padding: 9px 16px;
  color: #355f54;
  font-weight: 800;
}
.checkout-layout { display: grid; grid-template-columns: minmax(0, 1fr) 350px; align-items: start; gap: 24px; }
.cart-list { display: grid; gap: 12px; }
.cart-item {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 15px;
  border: 1px solid #f0e7db;
  border-radius: 18px;
  background: #fff;
  padding: 13px;
}
.cart-item-art { position: relative; display: grid; width: 86px; height: 86px; place-items: center; overflow: hidden; border-radius: 15px; font-size: 3rem; }
.cart-item-art img { position: absolute; inset: 0; width: 100%; height: 100%; padding: 4px; object-fit: contain; }
.cart-item-art img[hidden] { display: none; }
.cart-item-art.image-fallback .cart-fallback { display: block; }
.cart-item-info p { margin: 5px 0; color: #887d8c; font-size: 0.84rem; }
.item-quantity { color: #918694; font-size: 0.78rem; }
.item-total { white-space: nowrap; color: #5f506e; }
.remove-button { border: 0; background: transparent; color: #c16b7d; font-size: 0.78rem; }
.order-card { border: 1px solid #efe5da; border-radius: 20px; background: #fff; padding: 21px; }
.order-card > h3 { margin: 0 0 18px; color: #59496b; font-size: 1.1rem; }
.summary-row, .summary-total { display: flex; justify-content: space-between; gap: 12px; color: #817785; font-size: 0.9rem; }
.summary-row { margin: 12px 0; }
.shipping-hint { margin: 12px 0; border-radius: 10px; background: #fff5d9; padding: 9px 10px; color: #8a7040; font-size: 0.76rem; line-height: 1.4; }
.summary-total { margin-top: 16px; border-top: 1px solid #eee6ed; padding-top: 16px; color: #5b4a6d; font-size: 1rem; }
.summary-total strong { font-size: 1.2rem; }
.primary-button { width: 100%; margin-top: 17px; padding: 13px 16px; }
.payment-choice { margin-top: 21px; }
.payment-choice h4 { margin: 0 0 11px; color: #665574; font-size: 0.9rem; }
.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
  border: 1px solid #eee5ed;
  border-radius: 12px;
  padding: 11px 9px;
  cursor: pointer;
}
.payment-option input { accent-color: #6ba991; }
.payment-symbol { font-size: 1.3rem; }
.payment-option strong, .payment-option small { display: block; }
.payment-option strong { color: #61526d; font-size: 0.8rem; }
.payment-option small { margin-top: 3px; color: #968a99; font-size: 0.68rem; }
.demo-warning { margin-top: 13px; border: 1px solid #f0d493; border-radius: 12px; background: #fff8e6; padding: 12px; color: #775f38; font-size: 0.78rem; line-height: 1.45; }
.demo-warning p { margin: 4px 0 0; }
.secure-note { display: flex; align-items: flex-start; gap: 8px; margin: 15px 0 0; color: #81838a; font-size: 0.74rem; line-height: 1.5; }
.empty-state { display: grid; justify-items: center; border: 2px dashed #e7d9e8; border-radius: 20px; background: #fff; padding: 38px 20px; text-align: center; }
.empty-state > span { font-size: 3rem; }
.empty-state h3 { margin: 12px 0 6px; color: #5d4c6e; }
.empty-state p { margin: 0; color: #837889; font-size: 0.9rem; }
.empty-state button { margin-top: 17px; border: 0; border-radius: 11px; background: #a8dac7; padding: 10px 15px; color: #355f54; font-weight: 800; }
.order-complete { display: grid; justify-items: center; max-width: 650px; margin: 10px auto; border: 1px solid #efe5da; border-radius: 24px; background: #fff; padding: 36px; text-align: center; }
.complete-icon { margin-bottom: 12px; font-size: 4rem; }
.order-complete h3 { margin: 9px 0; color: #564667; font-size: 1.7rem; }
.order-complete > p { margin: 0; color: #817785; line-height: 1.6; }
.order-complete .secure-note { margin-top: 17px; border-radius: 12px; background: #f5faf6; padding: 12px; text-align: left; }
.order-complete .primary-button { max-width: 260px; }
.trust-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  width: min(1160px, calc(100% - 48px));
  margin: 47px auto;
  border-top: 1px solid #eee4dc;
  border-bottom: 1px solid #eee4dc;
  padding: 22px 4px;
}
.trust-strip > div { display: grid; grid-template-columns: 37px 1fr; column-gap: 10px; align-items: center; }
.trust-strip > div > span { grid-row: span 2; font-size: 1.5rem; }
.trust-strip strong { color: #655573; font-size: 0.83rem; }
.trust-strip small { margin-top: 3px; color: #918795; font-size: 0.72rem; }
.site-footer { display: grid; justify-items: center; gap: 8px; padding: 24px 20px 30px; background: #f5ecdf; text-align: center; }
.footer-brand { font-size: 1.25rem; }
.footer-brand .brand-icon { font-size: 1.4rem; }
.site-footer p { margin: 0; color: #766b79; font-size: 0.82rem; }
.site-footer small { color: #998e9b; font-size: 0.7rem; }

@media (max-width: 850px) {
  .hero { min-height: 320px; padding: 34px; }
  .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .checkout-layout { grid-template-columns: minmax(0, 1fr) 310px; gap: 16px; }
  .cart-item { grid-template-columns: 70px minmax(0, 1fr) auto; gap: 11px; }
  .cart-item-art { width: 70px; height: 70px; font-size: 2.5rem; }
  .remove-button { grid-column: 2 / -1; justify-self: end; }
}
@media (max-width: 640px) {
  .site-header, .hero, .shop-area, .trust-strip { width: min(100% - 28px, 500px); }
  .site-header { min-height: 70px; gap: 10px; }
  .brand { gap: 5px; font-size: 1.25rem; }
  .brand-icon { font-size: 1.4rem; }
  .main-nav { gap: 10px; }
  .nav-link { font-size: 0.8rem; }
  .account-actions { gap: 5px; }
  .welcome-name { display: none; }
  .account-button { padding: 7px 10px; font-size: 0.75rem; }
  .hero { grid-template-columns: 1fr; gap: 0; margin-bottom: 32px; padding: 29px 25px 12px; }
  .hero h1 { max-width: 420px; font-size: clamp(2.35rem, 11vw, 3.5rem); }
  .hero-art { min-height: 190px; }
  .sun-shape { width: 175px; }
  .toy-bear { font-size: 7rem; }
  .toy-blocks { font-size: 2.8rem; }
  .toy-balloon { font-size: 2.7rem; }
  .shop-heading { align-items: flex-start; flex-direction: column; gap: 7px; }
  .login-strip { align-items: stretch; flex-direction: column; padding: 15px; }
  .login-form input { flex: 1; width: auto; }
  .product-grid { gap: 12px; }
  .product-art { min-height: 145px; }
  .product-art { min-height: 175px; }
  .product-image { padding: 8px; }
  .product-info { padding: 13px; }
  .product-info h3 { font-size: 0.92rem; }
  .product-info > p { min-height: 55px; font-size: 0.76rem; }
  .price { font-size: 0.95rem; }
  .product-buy-row button { padding: 8px 11px; font-size: 0.78rem; }
  .checkout-layout { grid-template-columns: 1fr; }
  .cart-item { grid-template-columns: 60px minmax(0, 1fr) auto; padding: 10px; }
  .cart-item-art { width: 60px; height: 60px; font-size: 2.1rem; }
  .item-total { font-size: 0.82rem; }
  .trust-strip { grid-template-columns: 1fr; gap: 15px; margin: 34px auto; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
}
</style>
