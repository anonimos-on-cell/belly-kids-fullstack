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

## Armazenamento de dados

O backend usa SQLite para persistir os itens das sacolinhas. Na primeira inicialização, o banco e a tabela são criados automaticamente em `backend/data/ballykids.sqlite`. Essa pasta é ignorada pelo Git, então cada ambiente mantém seu próprio arquivo de dados. Se necessário, defina `DATABASE_PATH` para usar outro caminho; caminhos relativos são resolvidos a partir da pasta em que o backend foi iniciado.

Os itens permanecem disponíveis após reiniciar o backend e são separados por usuário e produto. Os códigos de login continuam sendo contas fixas de demonstração definidas no código; não há cadastro de usuários nem armazenamento de dados de pagamento.

## Frontend

A interface Vue oferece navegação responsiva para Início, Produtos, Sobre, Contato e Pagamento. As rotas públicas correspondentes são `/index.html`, `/produtos.html`, `/sobre.html`, `/contato.html` e `/pagamento.html`; a sacolinha autenticada fica em `/sacolinha`.

Na página inicial há um carrossel de produtos que utiliza o catálogo já existente. A sacolinha e o checkout continuam integrados à API; o pagamento é apenas demonstrativo. O formulário de contato valida os campos no navegador, mas não envia mensagens ao backend.

Para executar somente o frontend:

```bash
npm run dev --prefix frontend
```

### Demonstração em um único arquivo HTML

O arquivo [`bellykids-aplicacao.html`](./bellykids-aplicacao.html) contém uma versão independente da interface, com CSS e JavaScript embutidos. Abra-o diretamente no navegador para explorar as telas e testar o fluxo demonstrativo. A seção **Estrutura & Git** desse arquivo resume a arquitetura, estilos, interatividade e estado do versionamento observados no projeto original. A cópia simula login e sacolinha no armazenamento local do navegador; não se conecta à API Express nem altera o backend. As imagens do catálogo usam os endereços externos definidos no projeto e podem exigir conexão com a internet.

## Testar o backend pelo Insomnia

### 1. Inicie a API

Na raiz do projeto, configure `backend/.env` conforme a seção **Como Executar** e inicie os servidores:

```bash
npm run dev
```

O backend fica disponível em `http://localhost:3000`. Também é possível iniciar somente a API em outro terminal:

```bash
npm run dev:backend
```

No Insomnia, crie um Environment com a URL base:

```json
{
  "base_url": "http://localhost:3000"
}
```

### 2. Confirme que a API está ativa

Crie uma requisição `GET` para `{{ base_url }}/`.

Resposta esperada, status `200`:

```json
{
  "status": "API Ballykids em execução"
}
```

### 3. Faça login e obtenha o token

Crie uma requisição `POST` para `{{ base_url }}/api/auth/login`.

Em **Body → JSON**, envie um dos códigos de demonstração:

```json
{
  "code": "BK-9876"
}
```

O outro código disponível é `BK-1234`. A resposta de sucesso (`200`) inclui o token e os dados do usuário:

```json
{
  "message": "Login efetuado com sucesso!",
  "token": "<token retornado pela API>",
  "user": {
    "id": "user_01",
    "name": "Cliente Ballykids"
  }
}
```

Copie o valor de `token` para uma variável `token` no Environment do Insomnia. O token é temporário e pode ser renovado fazendo login novamente.

### 4. Configure a autenticação das requisições da sacolinha

Nas requisições protegidas, abra a aba **Auth**, selecione **Bearer Token** e informe `{{ token }}`. Alternativamente, adicione o header:

```text
Authorization: Bearer {{ token }}
```

Para enviar corpos JSON, use também:

```text
Content-Type: application/json
```

### 5. Experimente as rotas

| Método   | URL                           | Body JSON                      | Resultado                                 |
| -------- | ----------------------------- | ------------------------------ | ----------------------------------------- |
| `GET`    | `{{ base_url }}/api/cart`     | —                              | Consulta a sacolinha do usuário           |
| `POST`   | `{{ base_url }}/api/cart/add` | `{"productId":1,"quantity":2}` | Adiciona duas unidades do produto de ID 1 |
| `DELETE` | `{{ base_url }}/api/cart/1`   | —                              | Remove o produto de ID 1                  |
| `DELETE` | `{{ base_url }}/api/cart`     | —                              | Limpa toda a sacolinha                    |

Exemplo de resposta da consulta e das operações:

```json
{
  "cart": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

A resposta de adicionar ou remover também pode conter o campo `message`. Para adicionar, `productId` e `quantity` devem ser números inteiros positivos:

```json
{
  "productId": 1,
  "quantity": 2
}
```

### Respostas de erro comuns

- `400`: corpo ausente/inválido ou identificador de produto inválido.
- `401`: código de login inválido ou token não enviado.
- `403`: token inválido ou expirado.

### Observações para os testes

- A sacolinha é persistida no arquivo SQLite local do backend e não é apagada ao reiniciar o servidor.
- Cada código de demonstração representa um usuário diferente e tem sua própria sacolinha.
- Os IDs de produto aceitos pela API precisam ser inteiros positivos; a sacolinha armazena ID e quantidade, não consulta um banco de produtos.
- Não compartilhe o token nem coloque o valor de `JWT_SECRET` nas requisições, prints ou arquivos versionados. O Insomnia precisa do token de acesso, não do segredo usado para assinar tokens no servidor.
- Esses endpoints não processam pagamentos. O checkout do frontend é demonstrativo.

## Verificação

```bash
npm run build
```

## Observações

- Os códigos `BK-9876` e `BK-1234` são usuários demonstrativos definidos no backend, não autenticação de produção.
- Os dados SQLite ficam no arquivo local `backend/data/ballykids.sqlite`. Faça cópias de segurança desse arquivo se precisar preservar os dados locais.
- O checkout continua demonstrativo e não armazena nem processa informações de pagamento.
- Configure `CORS_ORIGINS` com as origens explícitas do frontend ao executar fora do desenvolvimento local.

irei criar uma apresentaçãoi sobre esse projeto onde queor que analise as informações pedidas pelo professor e monte uma descrição para ser usada na criação das telas para a apresentação seguindo o tema do projeto:
Tempo sugerido por equipe: 10 a 15 minutos (sendo 10 min de apresentação + 3 a 5 min para feedback/perguntas da banca ou instrutor).

- Dinâmica do grupo: Todos os integrantes devem falar, demonstrando domínio coletivo e divisão clara de papéis.

Roteiro Obrigatório por Apresentação1. Introdução e Contextualização do Projeto (1 a 2 min)

- Nome do projeto / Identidade visual: Apresentação da marca, logotipo e propósito da página.
- Problema e Público-Alvo: Que dor ou necessidade real essa aplicação resolve? Para quem ela foi construída?
- Equipe e Papéis: Apresentação rápida dos integrantes e as frentes em que cada um atuou (ex.: estrutura, estilização, interatividade, versionamento).

2. Stack Tecnológica e Ferramentas (1 a 2 min)

- Ferramentas utilizadas: Tecnologias aprendidas no curso (ex.: HTML5 semântico, CSS3 moderno/Flexbox/Grid, JavaScript puro ou frameworks/bibliotecas, consumo de APIs, etc.).
- Fluxo de Trabalho e Versionamento: Como a equipe usou Git/GitHub (branches, pull requests, commits) e organização de tarefas (Kanban/Scrum).

3. Demonstração Prática (Live Demo / Pitch da Aplicação) (4 a 5 min)

- Navegação pelas funcionalidades: Demonstrar o fluxo do usuário em tempo real (evitar apenas prints estáticos).
- Responsividade: Exibir o layout adaptado para desktop e mobile (usando o modo de inspeção do navegador).
- Acessibilidade e Semântica: Breve destaque sobre uso de tags semânticas, contraste e usabilidade básica.

4. Destaques Técnicos e Desafios Superados (2 min)

- Maior obstáculo técnico: Qual foi o principal bug ou bloqueio e como a equipe investigou e resolveu o problema.

5. Conclusão e Próximos Passos (1 min)

- Balanço da experiência: Lições aprendidas durante o ciclo de desenvolvimento.
- Visão de futuro: Se o projeto continuasse, quais seriam as próximas funcionalidades (ex.: autenticação, integração com banco de dados, deploy em produção).

Plano B para o Demo: Sempre deixar a aplicação rodando localmente e ter prints/vídeos curtos gravados das interações principais caso a internet ou a rede falhe.
README no GitHub: Garantir que o repositório público tenha um README.md com instruções de execução, tecnologias usadas e fotos do projeto.
Evitar leitura de slides: Os slides devem servir apenas de apoio visual; o foco deve estar na fala dos alunos e na tela da aplicação.

Analisei o projeto e preparei um roteiro visual em ROTEIRO-APRESENTACAO.md, com proposta de identidade visual, conteúdo e fala sugerida para cada slide, demonstração ao vivo e plano B.

O roteiro prevê cerca de 11 minutos, incluindo 4,5 minutos de demo e 2 minutos para destaques técnicos e desafio, além do tempo para perguntas. As informações foram baseadas no README.md e na interface em App.vue.

Deixei campos para a equipe preencher nomes, papéis, processo de versionamento e o desafio realmente enfrentado — esses detalhes não podem ser confirmados apenas pelo código. Login, checkout e pagamento continuam demonstrativos; os itens da sacolinha agora são persistidos em SQLite local. Como é um material documental, não foi necessário rodar testes.
