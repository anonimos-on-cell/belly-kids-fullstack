# Ballykids Fullstack

Projeto unificado contendo Frontend e Backend.

## Como Executar

1. Instale as dependências:
```bash
npm run install:all
```

2. Crie a configuração local do backend:
```powershell
Copy-Item backend/.env.example backend/.env
```

Edite `backend/.env` e substitua `JWT_SECRET` por uma chave aleatória com pelo menos 32 caracteres. Não use o valor de exemplo em produção. Uma chave pode ser gerada com:
```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

3. Inicie os servidores:
```bash
npm run dev
```

- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173
- A API é acessada pelo proxy do Vite em `/api`.

## Verificação

```bash
npm run build
```

## Observações

- Os códigos `BK-9876` e `BK-1234` são usuários demonstrativos definidos no backend, não autenticação de produção.
- O carrinho fica em memória e é reiniciado quando o backend é reiniciado; configure um banco de dados antes de uso real.
- Configure `CORS_ORIGINS` com as origens explícitas do frontend ao executar fora do desenvolvimento local.
