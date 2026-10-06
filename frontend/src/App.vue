<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
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
type SiteView = 'home' | 'products' | 'about' | 'contact' | 'commerce';
type PaymentMethod = 'pix-demo' | 'delivery-demo';

function viewFromPath(path: string): SiteView {
  if (path === '/produtos' || path === '/produtos.html') return 'products';
  if (path === '/sobre' || path === '/sobre.html') return 'about';
  if (path === '/contato' || path === '/contato.html') return 'contact';
  if (path === '/pagamento' || path === '/pagamento.html' || path === '/sacolinha') return 'commerce';
  return 'home';
}

const initialView = viewFromPath(window.location.pathname);

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
const page = ref<Page>(
  window.location.pathname.startsWith('/pagamento')
    ? 'checkout'
    : window.location.pathname === '/sacolinha'
      ? 'cart'
      : 'store'
);
const siteView = ref<SiteView>(initialView);
const paymentMethod = ref<PaymentMethod>('pix-demo');
const loading = ref(false);
const updatingCart = ref(false);
const mobileMenuOpen = ref(false);
const carouselIndex = ref(0);
const carouselVisibleCount = ref(3);
const carouselPaused = ref(false);
const contactForm = ref({ name: '', email: '', phone: '', subject: '', message: '' });
const carouselPointerStart = ref<number | null>(null);
let carouselTimer: number | undefined;

const carouselProducts = computed(() =>
  Array.from({ length: carouselVisibleCount.value }, (_, offset) =>
    products[(carouselIndex.value + offset) % products.length]
  )
);

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
  return updateCart(() => api.addToCart(product.id, 1, token.value), `${product.name} foi para a sacolinha!`);
}

async function removeFromCart(productId: number) {
  await updateCart(() => api.removeFromCart(productId, token.value), 'Brinquedo removido da sacolinha.');
}

async function changeQuantity(item: CartItem, quantity: number) {
  if (quantity < 1) {
    await removeFromCart(item.productId);
    return;
  }

  if (!isLoggedIn.value || updatingCart.value) return;
  updatingCart.value = true;
  try {
    await api.removeFromCart(item.productId, token.value);
    const response = await api.addToCart(item.productId, quantity, token.value);
    cart.value = response.cart;
    showStatus(response.message ?? 'Quantidade atualizada.');
  } catch (error) {
    try {
      await loadCart();
    } catch (reloadError) {
      showStatus(
        `${error instanceof Error ? error.message : 'Não foi possível atualizar a quantidade.'} Não foi possível sincronizar a sacolinha: ${reloadError instanceof Error ? reloadError.message : 'erro desconhecido.'}`,
        'error'
      );
      return;
    }
    showStatus(error instanceof Error ? error.message : 'Não foi possível atualizar a quantidade.', 'error');
  } finally {
    updatingCart.value = false;
  }
}

function navigate(view: SiteView) {
  const paths: Record<SiteView, string> = {
    home: '/index.html',
    products: '/produtos.html',
    about: '/sobre.html',
    contact: '/contato.html',
    commerce: '/pagamento.html'
  };
  siteView.value = view;
  page.value = view === 'commerce' ? 'checkout' : 'store';
  mobileMenuOpen.value = false;
  status.value = '';
  history.pushState({}, '', paths[view]);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function syncPath() {
  siteView.value = viewFromPath(window.location.pathname);
  if (window.location.pathname === '/sacolinha') page.value = 'cart';
  else if (siteView.value === 'commerce') page.value = 'checkout';
  else page.value = 'store';
  mobileMenuOpen.value = false;
}

function goToCart() {
  if (!isLoggedIn.value) {
    showStatus('Entre com seu código para acessar sua sacolinha.', 'error');
    return;
  }
  page.value = 'cart';
  siteView.value = 'commerce';
  mobileMenuOpen.value = false;
  history.pushState({}, '', '/sacolinha');
  status.value = '';
}

async function buyNow(product: Product) {
  const added = await addToCart(product);
  if (added) {
    page.value = 'checkout';
    navigate('commerce');
  }
}

function submitContact() {
  showStatus('Mensagem registrada nesta demonstração. Nenhuma mensagem foi enviada a um servidor.', 'success');
  contactForm.value = { name: '', email: '', phone: '', subject: '', message: '' };
}

function moveCarousel(direction: number) {
  carouselIndex.value = (carouselIndex.value + direction + products.length) % products.length;
}

function handleCarouselPointerUp(event: PointerEvent) {
  if (carouselPointerStart.value === null) return;
  const distance = event.clientX - carouselPointerStart.value;
  if (Math.abs(distance) > 40) moveCarousel(distance < 0 ? 1 : -1);
  carouselPointerStart.value = null;
}

function updateCarouselCount() {
  carouselVisibleCount.value = window.matchMedia('(max-width: 600px)').matches
    ? 1
    : window.matchMedia('(max-width: 1024px)').matches
      ? 2
      : 3;
}

function openCart() {
  goToCart();
}

function startCheckout() {
  if (cartItems.value.length === 0) {
    navigate('products');
    showStatus('Sua sacolinha está vazia. Escolha um brinquedo primeiro.', 'error');
    return;
  }
  navigate('commerce');
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
  navigate('home');
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

onMounted(() => {
  void loadInitialCart();
  updateCarouselCount();
  window.addEventListener('resize', updateCarouselCount);
  window.addEventListener('popstate', syncPath);
  carouselTimer = window.setInterval(() => {
    if (!carouselPaused.value && siteView.value === 'home') moveCarousel(1);
  }, 4000);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCarouselCount);
  window.removeEventListener('popstate', syncPath);
  if (carouselTimer !== undefined) window.clearInterval(carouselTimer);
});
</script>

<template>
  <main class="storefront">
    <div class="announcement">
      <span aria-hidden="true">✨</span>
      Cuidado e carinho em cada escolha
      <span aria-hidden="true">✨</span>
    </div>

    <header class="site-header">
      <a class="brand" href="/index.html" aria-label="BellyKids início" @click.prevent="navigate('home')">
        <span class="brand-icon" aria-hidden="true">🧸</span>
        <span>Belly<span>Kids</span></span>
      </a>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="mobileMenuOpen"
        aria-controls="main-navigation"
        :aria-label="mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <span></span><span></span><span></span>
      </button>

      <nav id="main-navigation" class="main-nav" :class="{ 'is-open': mobileMenuOpen }" aria-label="Navegação principal">
        <a class="nav-link" href="/index.html" :aria-current="siteView === 'home' ? 'page' : undefined" @click.prevent="navigate('home')">Início</a>
        <a class="nav-link" href="/produtos.html" :aria-current="siteView === 'products' ? 'page' : undefined" @click.prevent="navigate('products')">Produtos</a>
        <a class="nav-link" href="/sobre.html" :aria-current="siteView === 'about' ? 'page' : undefined" @click.prevent="navigate('about')">Sobre</a>
        <a class="nav-link" href="/contato.html" :aria-current="siteView === 'contact' ? 'page' : undefined" @click.prevent="navigate('contact')">Contato</a>
        <button class="nav-link nav-cart" :class="{ active: page === 'cart' }" @click="openCart">
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

    <section v-if="siteView === 'home'" class="hero">
      <div class="hero-copy">
        <span class="hero-kicker">Cuidado em cada detalhe</span>
        <h1>Carinho que acompanha <span>cada fase.</span></h1>
        <p>Produtos escolhidos com cuidado para acolher os primeiros momentos e acompanhar novas descobertas.</p>
        <button class="hero-button" @click="navigate('products')">Conhecer produtos <span aria-hidden="true">→</span></button>
        <div class="hero-promise">
          <span aria-hidden="true">♡</span> Feito para cuidar de quem você ama
        </div>
      </div>
      <div class="hero-art" role="img" aria-label="Ilustração delicada de itens para bebê">
        <div class="sun-shape"></div>
        <span class="hero-toy toy-bear" aria-hidden="true">🧸</span>
        <span class="hero-toy toy-blocks" aria-hidden="true">☁️</span>
        <span class="hero-toy toy-balloon" aria-hidden="true">✿</span>
        <span class="hero-star star-one" aria-hidden="true">✦</span>
        <span class="hero-star star-two" aria-hidden="true">♡</span>
      </div>
    </section>

    <section v-if="siteView === 'home'" class="featured-section" aria-labelledby="featured-title">
      <div class="section-heading">
        <div>
          <span class="section-kicker">Uma seleção especial</span>
          <h2 id="featured-title">Pequenos cuidados, grandes momentos</h2>
        </div>
        <a href="/produtos.html" class="text-link" @click.prevent="navigate('products')">Ver todos os produtos <span aria-hidden="true">→</span></a>
      </div>
      <div
        class="carousel"
        aria-roledescription="carrossel"
        aria-label="Produtos em destaque"
        @mouseenter="carouselPaused = true"
        @mouseleave="carouselPaused = false"
        @pointerdown="carouselPointerStart = $event.clientX"
        @pointerup="handleCarouselPointerUp"
        @pointercancel="carouselPointerStart = null"
      >
        <div class="carousel-track">
          <article v-for="product in carouselProducts" :key="product.id" class="product-card">
            <div class="product-art" :class="product.color">
              <span class="product-tag">{{ product.colorName }}</span>
              <span class="product-fallback" aria-hidden="true">{{ product.emoji }}</span>
              <img class="product-image" :src="product.image" :alt="product.name" loading="lazy" @error="hideBrokenImage" />
            </div>
            <div class="product-info">
              <span class="product-brand">BellyKids</span>
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <strong class="price">{{ currency.format(product.price) }}</strong>
              <div class="product-actions">
                <button class="buy-now" :disabled="updatingCart" @click="buyNow(product)">Comprar agora</button>
                <button class="add-button" :disabled="updatingCart" @click="addToCart(product)">Adicionar à sacolinha</button>
              </div>
            </div>
          </article>
        </div>
        <div class="carousel-controls">
          <button class="carousel-arrow" aria-label="Produtos anteriores" @click="moveCarousel(-1)">‹</button>
          <div class="carousel-dots" aria-label="Escolher produto em destaque">
            <button
              v-for="(product, index) in products"
              :key="product.id"
              :aria-label="`Mostrar destaque ${index + 1}: ${product.name}`"
              :aria-current="index === carouselIndex ? 'true' : undefined"
              :class="{ selected: index === carouselIndex }"
              @click="carouselIndex = index"
            ></button>
          </div>
          <button class="carousel-arrow" aria-label="Próximos produtos" @click="moveCarousel(1)">›</button>
        </div>
      </div>
    </section>

    <section v-if="siteView === 'home'" class="benefits-section" aria-label="Nossos diferenciais">
      <article><span aria-hidden="true">♡</span><h3>Escolhidos com carinho</h3><p>Uma curadoria pensada para a rotina de quem cuida.</p></article>
      <article><span aria-hidden="true">✧</span><h3>Praticidade no dia a dia</h3><p>Pequenos detalhes que deixam cada fase mais leve.</p></article>
      <article><span aria-hidden="true">✓</span><h3>Compra simples e segura</h3><p>Uma experiência clara do começo ao fim.</p></article>
    </section>

    <section v-if="siteView === 'home'" class="about-preview">
      <div class="about-mark" aria-hidden="true">B<span>K</span></div>
      <div>
        <span class="section-kicker">Um pouco sobre nós</span>
        <h2>Cuidado para acompanhar o que mais importa.</h2>
        <p>A BellyKids nasceu para reunir produtos úteis e delicados para bebês e crianças pequenas, com atenção a cada escolha e às famílias que confiam em nós.</p>
        <a href="/sobre.html" class="text-link" @click.prevent="navigate('about')">Conheça a BellyKids <span aria-hidden="true">→</span></a>
      </div>
    </section>

    <section v-if="siteView === 'home'" class="home-cta">
      <div><span class="section-kicker">Pronto para encontrar seu favorito?</span><h2>Um cuidado especial em cada descoberta.</h2></div>
      <button class="hero-button" @click="navigate('products')">Explorar produtos <span aria-hidden="true">→</span></button>
    </section>

    <section v-if="siteView === 'about'" class="editorial-page">
      <div class="editorial-heading">
        <span class="section-kicker">Nossa história</span>
        <h1>Cuidado que cresce junto com a sua família.</h1>
        <p>A BellyKids reúne produtos para os primeiros anos com atenção ao conforto, à praticidade e aos momentos que ficam na memória.</p>
      </div>
      <div class="about-values">
        <article><span>01</span><h2>Nossa missão</h2><p>Ajudar famílias a encontrar itens úteis e acolhedores para o dia a dia dos bebês e das crianças.</p></article>
        <article><span>02</span><h2>Nossa visão</h2><p>Ser uma loja de confiança, reconhecida pela experiência simples e pelo cuidado em cada escolha.</p></article>
        <article><span>03</span><h2>Nossos valores</h2><p>Carinho, transparência, praticidade e respeito por cada família e por cada fase da infância.</p></article>
      </div>
      <div class="about-commitment"><span aria-hidden="true">♡</span><div><h2>Nosso compromisso com você</h2><p>Trabalhamos para apresentar informações claras, facilitar sua navegação e oferecer um atendimento atencioso. Os pagamentos disponíveis nesta versão são demonstrativos.</p></div></div>
    </section>

    <section v-if="siteView === 'contact'" class="editorial-page contact-page">
      <div class="editorial-heading">
        <span class="section-kicker">Estamos aqui para ajudar</span>
        <h1>Vamos conversar?</h1>
        <p>Envie sua mensagem pelo formulário. Esta versão é uma demonstração e não envia os dados para um servidor.</p>
      </div>
      <form class="contact-form" @submit.prevent="submitContact">
        <label>Nome<input v-model.trim="contactForm.name" name="name" autocomplete="name" required maxlength="100" /></label>
        <label>E-mail<input v-model.trim="contactForm.email" name="email" type="email" autocomplete="email" required maxlength="160" /></label>
        <label>Telefone <span>(opcional)</span><input v-model.trim="contactForm.phone" name="phone" type="tel" autocomplete="tel" /></label>
        <label>Assunto<input v-model.trim="contactForm.subject" name="subject" required maxlength="120" /></label>
        <label class="message-field">Mensagem<textarea v-model.trim="contactForm.message" name="message" rows="5" required maxlength="1000"></textarea></label>
        <button class="hero-button" type="submit">Enviar mensagem</button>
      </form>
    </section>

    <section v-if="!isLoggedIn && (siteView === 'home' || siteView === 'products')" class="login-strip">
      <div class="login-copy">
        <span class="login-mascot" aria-hidden="true">♡</span>
        <div><strong>Entre para guardar seus produtos na sacolinha</strong><p>Digite seu código mágico para continuar.</p></div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label class="visually-hidden" for="customer-code">Código mágico</label>
        <input id="customer-code" v-model="code" placeholder="Ex.: BK-9876" maxlength="10" autocomplete="one-time-code" />
        <button :disabled="loading">{{ loading ? 'Entrando…' : 'Entrar' }}</button>
      </form>
    </section>

    <section v-if="siteView === 'products' || siteView === 'commerce'" class="shop-area">
      <div class="shop-heading">
        <div>
          <span class="section-kicker">{{ page === 'store' ? 'Conheça nossa seleção' : 'Seu pedido' }}</span>
          <h2>{{ page === 'store' ? 'Produtos escolhidos com carinho' : page === 'cart' ? 'Sua sacolinha' : page === 'checkout' ? 'Revisar seu pedido' : 'Pedido de demonstração' }}</h2>
        </div>
        <button v-if="page !== 'store'" class="back-link" @click="navigate('products')">← Voltar aos produtos</button>
      </div>

      <div v-if="status && (siteView === 'products' || siteView === 'commerce')" class="status-box" :class="{ success: statusKind === 'success' }" role="status">
        {{ status }}
      </div>

      <section v-if="siteView === 'products' && page === 'store'" class="product-grid" aria-label="Catálogo de produtos">
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
            <span class="product-brand">BellyKids</span>
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <strong class="price">{{ currency.format(product.price) }}</strong>
            <div class="product-actions">
              <button class="buy-now" :disabled="updatingCart" @click="buyNow(product)">Comprar agora</button>
              <button class="add-button" :disabled="updatingCart" :aria-label="`Adicionar ${product.name} à sacolinha`" @click="addToCart(product)">Adicionar à sacolinha</button>
            </div>
          </div>
        </article>
      </section>

      <div v-else-if="siteView === 'commerce' && (page === 'cart' || page === 'checkout')" class="checkout-layout">
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
            <button @click="navigate('products')">Ver produtos</button>
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
              <div class="quantity-control" :aria-label="`Quantidade de ${item.product.name}`">
                <button :disabled="updatingCart" :aria-label="`Diminuir quantidade de ${item.product.name}`" @click="changeQuantity(item, item.quantity - 1)">−</button>
                <span class="item-quantity">{{ item.quantity }}</span>
                <button :disabled="updatingCart" :aria-label="`Aumentar quantidade de ${item.product.name}`" @click="changeQuantity(item, item.quantity + 1)">+</button>
              </div>
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

      <section v-else-if="siteView === 'commerce' && page === 'complete'" class="order-complete">
        <span class="complete-icon" aria-hidden="true">🎉</span>
        <span class="section-kicker">Tudo certo por aqui</span>
        <h3>Seu pedido de teste foi concluído!</h3>
        <p>Esta é uma confirmação visual. Não houve cobrança, pagamento ou envio real.</p>
        <div class="secure-note"><span aria-hidden="true">🔒</span> Para vender de verdade, esta etapa precisa ser conectada a um provedor de pagamento seguro.</div>
        <button class="primary-button" @click="navigate('products')">Continuar explorando</button>
      </section>
    </section>

    <div v-if="status && (siteView === 'home' || siteView === 'contact')" class="status-box global-status" :class="{ success: statusKind === 'success' }" role="status" aria-live="polite">
      {{ status }}
    </div>

    <section class="trust-strip" aria-label="Informações de segurança">
      <div><span aria-hidden="true">💛</span><strong>Escolhas com carinho</strong><small>Uma loja feita para brincar</small></div>
      <div><span aria-hidden="true">🔒</span><strong>Pagamento protegido</strong><small>Na loja real, via provedor seguro</small></div>
      <div><span aria-hidden="true">🌱</span><strong>Mais imaginação</strong><small>Momentos felizes em família</small></div>
    </section>

    <footer class="site-footer">
      <div class="footer-main">
        <div class="footer-about">
          <a class="brand footer-brand" href="/index.html" @click.prevent="navigate('home')"><span class="brand-icon" aria-hidden="true">♡</span><span>Belly<span>Kids</span></span></a>
          <p>Carinho que acompanha cada fase.</p>
        </div>
        <div><strong>Navegação</strong><a href="/index.html" @click.prevent="navigate('home')">Início</a><a href="/produtos.html" @click.prevent="navigate('products')">Produtos</a><a href="/sobre.html" @click.prevent="navigate('about')">Sobre</a><a href="/contato.html" @click.prevent="navigate('contact')">Contato</a></div>
        <div><strong>Atendimento</strong><a href="/contato.html" @click.prevent="navigate('contact')">Fale conosco</a><span>Atendimento pelo formulário de contato</span></div>
        <div><strong>Compra segura</strong><span>Checkout demonstrativo</span><span>Nenhum pagamento real é processado</span></div>
      </div>
      <small>© {{ new Date().getFullYear() }} BellyKids · Loja demonstrativa</small>
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

  /* Modern storefront layout */
  :root {
    font-family: Inter, Nunito, "Trebuchet MS", Arial, sans-serif;
    color: #38313a;
    background: #fff;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    --pink: #d34b83;
    --pink-light: #ef6ca8;
    --pink-pale: #fff7fb;
    --ink: #38313a;
    --muted: #77717a;
    --line: #f0e5ec;
    --content-width: 1200px;
  }

  html { min-width: 0; scroll-behavior: smooth; }
  body { min-width: 0; color: var(--ink); background: #fff; }
  button, input, textarea { font: inherit; }
  a { color: inherit; }
  .storefront { overflow: clip; background: #fff; }
  .announcement { background: #fff0f6; color: #8e3d63; font-size: .78rem; letter-spacing: .03em; }
  .site-header {
    position: relative;
    z-index: 5;
    width: min(var(--content-width), calc(100% - 64px));
    min-height: 86px;
  }
  .brand { color: #352c35; font-size: 1.55rem; letter-spacing: -.055em; }
  .brand > span:last-child > span { color: var(--pink); }
  .brand-icon { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 50%; background: var(--pink-pale); color: var(--pink); font-size: 1.35rem; }
  .main-nav { gap: clamp(16px, 2vw, 30px); }
  .nav-link {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    border: 0;
    background: transparent;
    color: #5f5861;
    font-size: .91rem;
    font-weight: 650;
    text-decoration: none;
    transition: color .18s ease;
  }
  .nav-link:hover, .nav-link[aria-current="page"], .nav-link.active { color: var(--pink); }
  .nav-cart { padding: 0 2px; }
  .menu-toggle { display: none; }
  .account-actions { gap: 14px; }
  .welcome-name { color: #635b65; }
  .account-button { min-height: 42px; border-color: #efd4e1; color: #8e3d63; }
  .hero {
    width: min(var(--content-width), calc(100% - 64px));
    min-height: clamp(390px, 40vw, 515px);
    margin: 8px auto 0;
    padding: clamp(32px, 6vw, 78px);
    border: 1px solid #f6e8ed;
    border-radius: 30px;
    background: linear-gradient(112deg, #fff6f9 0%, #fff1f5 57%, #f4f8ff 100%);
  }
  .hero-copy { max-width: 550px; }
  .hero-kicker, .section-kicker { color: #a44c70; font-size: .72rem; letter-spacing: .13em; }
  .hero h1 { max-width: 550px; color: #3c3038; font-size: clamp(2.5rem, 5vw, 4.6rem); font-weight: 750; letter-spacing: -.065em; line-height: 1.04; }
  .hero h1 span { color: var(--pink); }
  .hero-copy > p { max-width: 430px; color: #6f6870; font-size: clamp(.95rem, 1.4vw, 1.08rem); }
  .hero-button, .primary-button {
    min-height: 48px;
    border-radius: 12px;
    background: var(--pink);
    box-shadow: 0 3px 0 #b83c70;
    color: white;
    transition: background .18s ease, transform .18s ease, box-shadow .18s ease;
  }
  .hero-button { padding: 13px 21px; }
  .hero-button:hover, .primary-button:hover { transform: translateY(-2px); background: #bd3c71; box-shadow: 0 5px 0 #a93263; }
  .hero-promise { color: #77707a; }
  .hero-promise span { color: var(--pink); font-size: 1.15rem; }
  .hero-art { min-width: 0; }
  .sun-shape { width: min(360px, 86%); background: #ffe4ec; }
  .toy-bear { font-size: clamp(8rem, 17vw, 12rem); }
  .toy-blocks { color: #84a9ca; font-size: 4.6rem; }
  .toy-balloon { color: var(--pink); font-size: 3.8rem; }
  .hero-star { color: var(--pink); }
  .shop-area, .featured-section, .benefits-section, .about-preview, .editorial-page, .home-cta, .login-strip {
    width: min(var(--content-width), calc(100% - 64px));
    margin-right: auto;
    margin-left: auto;
  }
  .featured-section { padding-top: clamp(48px, 7vw, 88px); }
  .section-heading, .shop-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 25px; }
  .section-heading h2, .shop-heading h2, .about-preview h2, .home-cta h2 {
    margin: 8px 0 0;
    color: #3c333b;
    font-size: clamp(1.6rem, 3.2vw, 2.35rem);
    font-weight: 720;
    letter-spacing: -.045em;
    line-height: 1.15;
  }
  .text-link { color: #a43d6a; font-size: .88rem; font-weight: 700; text-decoration: none; }
  .text-link:hover { color: #c33e76; text-decoration: underline; text-underline-offset: 4px; }
  .carousel { touch-action: pan-y; }
  .carousel-track { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
  .product-card { border-color: var(--line); border-radius: 18px; box-shadow: 0 8px 26px rgb(55 35 47 / 4%); }
  .product-card:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgb(55 35 47 / 9%); }
  .product-art { min-height: clamp(190px, 22vw, 260px); }
  .product-art.peach, .cart-item-art.peach { background: #fff0eb; }
  .product-art.mint, .cart-item-art.mint { background: #edf7f2; }
  .product-art.lilac, .cart-item-art.lilac { background: #f2edf8; }
  .product-art.yellow, .cart-item-art.yellow { background: #fff7df; }
  .product-art.blue, .cart-item-art.blue { background: #edf5fb; }
  .product-art.pink, .cart-item-art.pink { background: #fff0f5; }
  .product-tag { color: #795967; }
  .product-brand { display: block; margin-bottom: 5px; color: #a15373; font-size: .7rem; font-weight: 750; letter-spacing: .06em; text-transform: uppercase; }
  .product-info { display: flex; min-height: 220px; flex-direction: column; align-items: flex-start; padding: 18px; }
  .product-info h3 { color: #38313a; font-size: 1.03rem; line-height: 1.35; }
  .product-info > p { min-height: 2.8em; color: #77717a; font-size: .83rem; line-height: 1.5; }
  .price { display: block; margin-top: auto; padding: 5px 0 12px; color: #3c333b; font-size: 1.05rem; font-weight: 750; }
  .product-actions { display: grid; width: 100%; gap: 8px; }
  .product-actions button { min-height: 42px; border-radius: 10px; font-size: .84rem; font-weight: 700; transition: background .18s ease, transform .18s ease; }
  .buy-now { border: 1px solid var(--pink); background: var(--pink); color: #fff; }
  .buy-now:hover { transform: translateY(-1px); background: #bd3c71; }
  .add-button { border: 1px solid #efd2df; background: #fff; color: #984163; }
  .add-button:hover { background: var(--pink-pale); }
  .product-actions button:disabled { opacity: .58; }
  .carousel-controls { display: flex; align-items: center; justify-content: center; gap: 18px; padding: 22px 0 0; }
  .carousel-arrow { display: grid; width: 38px; height: 38px; place-items: center; border: 1px solid #ecdde5; border-radius: 50%; background: #fff; color: #8f4567; font-size: 1.55rem; line-height: 1; }
  .carousel-arrow:hover { background: #fff5f8; }
  .carousel-dots { display: flex; gap: 7px; }
  .carousel-dots button { width: 8px; height: 8px; border: 0; border-radius: 99px; background: #e8dce2; padding: 0; }
  .carousel-dots button.selected { width: 22px; background: var(--pink); }
  .benefits-section { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; padding: clamp(48px, 7vw, 88px) 0; }
  .benefits-section article { padding: 24px; border: 1px solid #f1e6eb; border-radius: 16px; background: #fff; }
  .benefits-section article > span { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 12px; background: #fff1f6; color: var(--pink); font-size: 1.2rem; }
  .benefits-section h3 { margin: 17px 0 7px; color: #423941; font-size: 1rem; }
  .benefits-section p, .about-preview p { margin: 0; color: var(--muted); font-size: .9rem; line-height: 1.65; }
  .about-preview { display: grid; grid-template-columns: .8fr 1.2fr; align-items: center; gap: clamp(30px, 8vw, 100px); padding: 45px clamp(22px, 6vw, 72px); border-radius: 22px; background: #fbf6f8; }
  .about-mark { display: grid; width: min(230px, 100%); aspect-ratio: 1; place-items: center; justify-self: center; border-radius: 48% 52% 45% 55%; background: #f7e1e9; color: #a6446c; font-size: clamp(4rem, 10vw, 7rem); font-weight: 800; letter-spacing: -.1em; transform: rotate(-7deg); }
  .about-mark span { color: #db7799; }
  .about-preview h2 { max-width: 580px; margin: 12px 0; }
  .about-preview .text-link { display: inline-block; margin-top: 20px; }
  .home-cta { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-top: 65px; margin-bottom: 65px; padding: clamp(22px, 4vw, 42px); border-radius: 18px; background: #fff5f8; }
  .home-cta .section-kicker { letter-spacing: .08em; }
  .home-cta h2 { max-width: 620px; font-size: clamp(1.35rem, 2.6vw, 1.9rem); }
  .login-strip { margin-top: 26px; margin-bottom: 24px; border: 1px solid #f0e3ca; border-radius: 16px; background: #fffbf1; }
  .login-copy strong { color: #473e46; }
  .login-copy p { color: #77717a; }
  .login-mascot { color: var(--pink); }
  .login-form input { min-height: 44px; border-color: #e9dde4; }
  .login-form button { min-height: 44px; background: #79536a; }
  .shop-area { padding-top: 48px; }
  .shop-heading { margin-bottom: 25px; }
  .product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
  .checkout-layout { grid-template-columns: minmax(0, 1fr) minmax(280px, 370px); }
  .cart-item { grid-template-columns: 86px minmax(0, 1fr) auto auto; }
  .cart-item-info h3 { color: #38313a; }
  .quantity-control { display: inline-flex; align-items: center; gap: 11px; margin-top: 8px; }
  .quantity-control button { width: 31px; height: 31px; border: 1px solid #ead9e2; border-radius: 9px; background: #fff; color: #88435f; font-weight: 700; }
  .quantity-control button:hover { background: #fff5f8; }
  .quantity-control .item-quantity { min-width: 14px; color: #403840; font-size: .9rem; text-align: center; }
  .order-card, .empty-state, .order-complete { border-color: #eee3e9; box-shadow: 0 8px 26px rgb(55 35 47 / 4%); }
  .primary-button { background: var(--pink); box-shadow: 0 3px 0 #b83c70; }
  .payment-option input { accent-color: var(--pink); }
  .trust-strip { width: min(var(--content-width), calc(100% - 64px)); border-color: #f1e7ec; }
  .trust-strip strong { color: #423941; }
  .site-footer { margin-top: 72px; background: #faf6f8; text-align: left; }
  .footer-main { display: grid; width: min(var(--content-width), 100%); grid-template-columns: 1.4fr repeat(3, 1fr); gap: 34px; padding: 18px 20px 30px; }
  .footer-main > div { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
  .footer-main > div > strong { margin-bottom: 4px; color: #423941; font-size: .87rem; }
  .footer-main a, .footer-main span { color: #77717a; font-size: .81rem; text-decoration: none; }
  .footer-main a:hover { color: var(--pink); }
  .footer-main .footer-brand { color: #352c35; font-size: 1.35rem; }
  .footer-about p { margin: 0; color: #77717a; font-size: .82rem; }
  .site-footer > small { width: min(var(--content-width), 100%); border-top: 1px solid #eee5ea; padding: 17px 20px 0; color: #8c858d; text-align: center; }
  .editorial-page { padding-top: clamp(54px, 8vw, 95px); }
  .editorial-heading { max-width: 760px; margin: 0 auto 42px; text-align: center; }
  .editorial-heading h1 { margin: 12px 0; color: #3c333b; font-size: clamp(2.1rem, 5vw, 3.8rem); font-weight: 740; letter-spacing: -.06em; line-height: 1.08; }
  .editorial-heading p { max-width: 650px; margin: 0 auto; color: var(--muted); font-size: 1rem; line-height: 1.7; }
  .about-values { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
  .about-values article { padding: clamp(20px, 3vw, 32px); border: 1px solid var(--line); border-radius: 18px; background: #fff; }
  .about-values article > span { color: var(--pink); font-size: .77rem; font-weight: 800; letter-spacing: .1em; }
  .about-values h2, .about-commitment h2 { color: #433942; font-size: 1.15rem; }
  .about-values p, .about-commitment p { margin: 0; color: var(--muted); font-size: .91rem; line-height: 1.65; }
  .about-commitment { display: flex; align-items: flex-start; gap: 20px; margin-top: 20px; padding: 28px; border-radius: 18px; background: #fff5f8; }
  .about-commitment > span { color: var(--pink); font-size: 2rem; }
  .about-commitment h2 { margin: 2px 0 8px; }
  .contact-page { max-width: 900px; }
  .contact-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 17px; max-width: 760px; margin: 0 auto; padding: clamp(20px, 4vw, 36px); border: 1px solid var(--line); border-radius: 18px; background: #fff; box-shadow: 0 10px 34px rgb(55 35 47 / 5%); }
  .contact-form label { display: grid; gap: 7px; color: #49414a; font-size: .85rem; font-weight: 700; }
  .contact-form label span { color: #8d858d; font-weight: 400; }
  .contact-form input, .contact-form textarea { width: 100%; min-height: 45px; border: 1px solid #e8dfe4; border-radius: 10px; background: #fff; padding: 11px 12px; color: var(--ink); }
  .contact-form textarea { min-height: 130px; resize: vertical; }
  .contact-form .message-field { grid-column: 1 / -1; }
  .contact-form .hero-button { justify-self: start; }
  .global-status { width: min(var(--content-width), calc(100% - 64px)); margin-top: 22px; }

  @media (max-width: 1024px) {
    .site-header, .hero, .shop-area, .featured-section, .benefits-section, .about-preview, .editorial-page, .home-cta, .login-strip, .trust-strip, .global-status { width: min(100% - 44px, 900px); }
    .carousel-track, .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .checkout-layout { grid-template-columns: minmax(0, 1fr) minmax(255px, 310px); }
    .footer-main { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 760px) {
    .site-header { min-height: 72px; }
    .menu-toggle { display: flex; width: 44px; height: 44px; flex-direction: column; justify-content: center; gap: 5px; margin-left: auto; border: 1px solid #f0dce5; border-radius: 12px; background: #fff; padding: 0 11px; }
    .menu-toggle span { display: block; height: 2px; border-radius: 2px; background: #8c4564; }
    .main-nav { position: absolute; top: calc(100% - 2px); right: 0; left: 0; display: none; align-items: stretch; gap: 0; border: 1px solid #f0e4ea; border-radius: 14px; background: #fff; padding: 8px; box-shadow: 0 12px 26px rgb(55 35 47 / 10%); }
    .main-nav.is-open { display: flex; flex-direction: column; }
    .nav-link { min-height: 48px; border-radius: 9px; padding: 0 12px; }
    .nav-link:hover { background: #fff6f9; }
    .nav-cart { justify-content: flex-start; }
    .account-actions { margin-left: 0; }
    .account-button { min-height: 39px; padding: 7px 11px; }
    .hero { grid-template-columns: 1fr; gap: 0; padding: 32px clamp(22px, 6vw, 42px) 10px; }
    .hero-art { min-height: 220px; }
    .sun-shape { width: 195px; }
    .toy-bear { font-size: 7.5rem; }
    .toy-blocks { font-size: 3.2rem; }
    .toy-balloon { font-size: 2.7rem; }
    .section-heading { align-items: flex-start; flex-direction: column; gap: 10px; }
    .benefits-section { grid-template-columns: 1fr; gap: 12px; }
    .about-preview { grid-template-columns: 1fr; gap: 24px; }
    .about-mark { width: 130px; }
    .home-cta { align-items: flex-start; flex-direction: column; }
    .product-info { min-height: 225px; padding: 15px; }
    .product-actions { gap: 7px; }
    .checkout-layout { grid-template-columns: 1fr; }
    .cart-item { grid-template-columns: 66px minmax(0, 1fr) auto; gap: 10px; }
    .cart-item-art { width: 66px; height: 66px; }
    .remove-button { grid-column: 2 / -1; justify-self: end; }
    .about-values { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .site-header, .hero, .shop-area, .featured-section, .benefits-section, .about-preview, .editorial-page, .home-cta, .login-strip, .trust-strip, .global-status { width: min(100% - 32px, 500px); }
    .announcement { padding: 8px 10px; font-size: .7rem; }
    .site-header { min-height: 68px; gap: 9px; }
    .brand { gap: 7px; font-size: 1.28rem; }
    .brand-icon { width: 33px; height: 33px; font-size: 1.1rem; }
    .account-actions { gap: 0; }
    .welcome-name { display: none; }
    .account-button { font-size: .76rem; }
    .hero { margin-top: 4px; border-radius: 20px; }
    .hero h1 { font-size: clamp(2.25rem, 10vw, 3.3rem); }
    .hero-art { min-height: 185px; }
    .featured-section, .shop-area { padding-top: 48px; }
    .section-heading h2, .shop-heading h2 { font-size: 1.65rem; }
    .carousel-track, .product-grid { grid-template-columns: minmax(0, 1fr); }
    .product-art { min-height: 225px; }
    .product-info { min-height: 0; }
    .product-info > p { min-height: 0; }
    .product-actions button { min-height: 46px; }
    .carousel-controls { padding-top: 18px; }
    .login-strip { align-items: stretch; padding: 15px; }
    .login-form { width: 100%; }
    .login-form input { width: 100%; }
    .login-copy { align-items: flex-start; }
    .contact-form { grid-template-columns: 1fr; padding: 19px; }
    .contact-form .message-field { grid-column: auto; }
    .contact-form .hero-button { width: 100%; }
    .about-commitment { gap: 12px; padding: 20px; }
    .footer-main { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px 18px; }
    .footer-main .footer-about { grid-column: 1 / -1; }
    .trust-strip { grid-template-columns: 1fr; gap: 15px; margin: 35px auto; }
    .cart-item { grid-template-columns: 54px minmax(0, 1fr) auto; padding: 10px; }
    .cart-item-art { width: 54px; height: 54px; }
    .item-total { font-size: .82rem; }
    .order-complete { padding: 26px 18px; }
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
  }
</style>
