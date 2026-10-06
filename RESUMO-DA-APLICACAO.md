# Resumo da aplicação BellyKids

## Visão geral

A BellyKids é uma aplicação full-stack demonstrativa de loja virtual para produtos de bebês e crianças pequenas. O projeto reúne uma interface responsiva, uma API para autenticação e gerenciamento de sacolinha e um fluxo de checkout simulado.

## Tecnologias

- **Frontend:** Vue 3, TypeScript e Vite.
- **Backend:** Node.js, Express e TypeScript.
- **Persistência:** SQLite para os itens das sacolinhas.
- **Autenticação:** tokens JWT.
- **Comunicação:** API REST, com chamadas do frontend encaminhadas pelo prefixo `/api` durante o desenvolvimento.

## Funcionalidades do frontend

- Página inicial com apresentação da loja, benefícios e carrossel de produtos do catálogo existente.
- Catálogo com produtos, imagens, preços e ações para comprar ou adicionar à sacolinha.
- Navegação responsiva entre Início, Produtos, Sobre, Contato e Pagamento.
- Formulário de contato com validação no navegador.
- Sacolinha com visualização de produtos e alteração de quantidades.
- Checkout demonstrativo com resumo do pedido e aviso de que não há pagamento real.

## Funcionalidades do backend

- Verificação básica da API em `GET /`.
- Login por códigos de demonstração em `POST /api/auth/login`.
- Consulta da sacolinha em `GET /api/cart`.
- Inclusão de produto em `POST /api/cart/add`.
- Remoção de produto em `DELETE /api/cart/:productId`.
- Limpeza da sacolinha em `DELETE /api/cart`.
- Proteção das rotas da sacolinha por token Bearer.
- Persistência dos itens da sacolinha em SQLite, separados por usuário.

Os códigos demonstrativos disponíveis são `BK-9876` e `BK-1234`. Após o login, a API retorna um token JWT, que o frontend utiliza nas operações protegidas.

## Comunicação entre frontend e backend

1. A pessoa informa um código de demonstração na interface.
2. O frontend envia o código para a rota de login.
3. O backend valida o código e retorna os dados do usuário e um token JWT.
4. O frontend envia o token retornado no cabeçalho de autorização das requisições para consultar e alterar a sacolinha.
5. A API devolve as quantidades atualizadas e o frontend apresenta o resumo do pedido.

## Como executar

Na raiz do repositório:

```bash
npm run install:all
```

Crie o arquivo local de configuração do backend e defina um `JWT_SECRET` aleatório com pelo menos 32 caracteres:

```powershell
Copy-Item backend/.env.example backend/.env
```

Inicie frontend e backend:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

Para compilar e validar o projeto:

```bash
npm run build
```

## Limitações conhecidas

- O arquivo SQLite local é criado em `backend/data/ballykids.sqlite`; cada ambiente mantém sua própria base de dados.
- Os códigos de login são fixos e servem apenas para demonstração; não constituem autenticação de produção.
- O checkout não processa pagamentos e não se conecta a um gateway.
- O formulário de contato valida os campos no navegador, mas não envia os dados ao backend.
- O catálogo de produtos está definido no frontend; a API da sacolinha armazena identificadores de produto e quantidades.

## Possíveis evoluções

Para uma operação real, o projeto precisaria de autenticação de produção, envio do formulário a um serviço de atendimento, estratégia de backup/migração do banco e integração segura com um provedor de pagamentos.
