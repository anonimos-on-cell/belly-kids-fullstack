# Roteiro visual da apresentação — BellyKids

Material para orientar a criação dos slides e a fala da equipe. Este roteiro prevê cerca de **11 minutos de apresentação**, dentro da faixa sugerida de 10 a 15 minutos, reservando outros **3 a 5 minutos para perguntas e feedback**. Os slides são apoio visual: priorize a demonstração ao vivo e a participação de todos.

## Direção visual

- **Tema:** loja online acolhedora de produtos para bebês e crianças pequenas.
- **Identidade observada na aplicação:** nome BellyKids, ursinho e coração como elementos de marca; tons pastel de rosa, lilás, verde e amarelo sobre fundos claros; formas arredondadas e ilustrações delicadas.
- **Tom:** carinhoso, simples, familiar e confiável, sem parecer uma apresentação infantilizada demais.
- **Composição:** proporção 16:9, títulos curtos, pouco texto, capturas reais da aplicação, ícones simples e bom contraste. Use os mesmos tons e a marca da página; não invente um logotipo diferente.
- **Imagens:** dê preferência a capturas das telas reais. Não exiba dados pessoais, segredos, tokens ou chaves de configuração.
- **Animações:** sutis e pontuais. Evite transições que distraiam da fala ou da demonstração.

## Roteiro de slides — aproximadamente 11 minutos

### 1. Capa e propósito — 0:30

**Texto na tela**

> BellyKids  
> Carinho que acompanha cada fase  
> Uma experiência de loja online para produtos de bebês e crianças pequenas  
> [nomes dos integrantes] · [turma/curso] · [data]

**Visual:** marca BellyKids em destaque, fundo creme, detalhes em rosa e lilás e uma captura ou ilustração coerente com o hero da página inicial.

**Fala:** apresentar o nome e resumir o propósito do projeto em uma frase.

### 2. Necessidade e público — 0:45

**Texto na tela**

> **Para quem?** Famílias e pessoas responsáveis por bebês e crianças pequenas.  
> **Que necessidade atende?** Reunir produtos infantis em uma experiência digital simples, organizada e acolhedora.

**Visual:** composição leve com exemplos do catálogo (manta, bolsa, mordedor) e uma sequência visual “encontrar → escolher → revisar pedido”.

**Fala:** contextualizar a necessidade sem afirmar pesquisa de mercado ou validação com usuários se isso não foi realizado. Apresentar a BellyKids como uma loja virtual demonstrativa.

### 3. A experiência BellyKids — 0:45

**Texto na tela**

> Página inicial · Catálogo · Sacolinha · Checkout demonstrativo

**Visual:** quatro capturas reais em sequência, com setas discretas. Mostrar também as cores pastel, os cards de produtos e a marca da interface.

**Fala:** explicar rapidamente como a pessoa navega e como a identidade visual comunica cuidado e praticidade. A aplicação também oferece páginas “Sobre” e “Contato”.

### 4. Tecnologias e arquitetura — 1:00

**Texto na tela**

> **Frontend:** Vue 3 · TypeScript · Vite  
> **Backend:** Node.js · Express · TypeScript  
> **Integração:** API REST · autenticação demonstrativa com JWT

**Visual:** diagrama simples:

> Navegador (Vue) → API REST (Express) → SQLite (sacolinha persistida)

**Fala:** explicar que o frontend apresenta as telas e envia requisições; o backend valida os códigos de demonstração, emite um token JWT e protege as operações da sacolinha. Os itens da sacolinha são persistidos em um arquivo SQLite local. O catálogo de produtos está definido no frontend.

### 5. Organização e participação da equipe — 0:30

**Texto na tela**

> **[Integrante 1]** — [responsabilidade realmente exercida]  
> **[Integrante 2]** — [responsabilidade realmente exercida]  
> **[Integrante 3]** — [responsabilidade realmente exercida]  
> **Versionamento e tarefas** — [como a equipe realmente trabalhou]

**Visual:** nomes em cartões com uma responsabilidade cada; incluir Git/GitHub, branches, commits, pull requests e quadro de tarefas apenas se tiverem sido usados.

**Fala:** cada pessoa resume sua contribuição e como se conectou ao trabalho dos demais. **Preencher com os nomes e práticas reais**: o repositório, por si só, não confirma a divisão de papéis nem o uso de Kanban, Scrum, branches ou pull requests.

### 6. Demonstração ao vivo — 4:30

**A tela serve como apoio; navegar pela aplicação aberta no navegador.**

1. **Página inicial e identidade visual (0:30):** mostrar marca, navegação e destaques.
2. **Catálogo (0:45):** abrir Produtos, percorrer cards, preços e ações “Adicionar à sacolinha”/“Comprar agora”.
3. **Login de demonstração (0:45):** usar um dos códigos públicos de teste documentados no README (`BK-9876` ou `BK-1234`) e explicar que não é cadastro real.
4. **Sacolinha (0:45):** mostrar produtos, quantidade, remoção e resumo de subtotal, entrega e total.
5. **Checkout e conclusão (0:45):** mostrar opções ilustrativas e concluir um pedido de teste. Dizer explicitamente que não há cobrança nem pagamento.
6. **Responsividade (0:30):** usar a inspeção do navegador para mostrar o menu e o layout em largura mobile; retornar ao desktop se necessário.
7. **Resumo da integração (0:30):** explicar verbalmente que o frontend consulta a API para atualizar a sacolinha. Não exibir o token nem dados de autenticação nas ferramentas do navegador.

**Se a sessão estiver zerada:** ter o código de demonstração à mão e entrar durante o pitch. Os itens da sacolinha ficam no arquivo SQLite local, mas os códigos de login continuam sendo demonstrações fixas.

### 7. Acessibilidade, desafio e aprendizado técnico — 2:00

**Texto na tela**

> Estrutura semântica · navegação identificada · estados de interação  
> **Desafio técnico:** [problema real] → [como investigamos] → [como resolvemos]

**Visual:** captura de um trecho da interface com chamadas pequenas para navegação, formulário rotulado, texto alternativo ou foco visível; ao lado, um esquema “problema → investigação → solução”.

**Fala:** apontar exemplos concretos observáveis: uso de `header`, `nav`, `main`, `section` e `footer`; rótulos e textos alternativos em controles/imagens; foco visível e adaptações de layout para telas menores. Evitar declarar conformidade completa com acessibilidade sem uma auditoria.

**Sobre o desafio:** substituir os campos entre colchetes pelo caso que a equipe realmente enfrentou. Se não houve um bug específico, apresentar como desafio de implementação a integração do token JWT com as rotas protegidas da sacolinha — sem dizer que foi um bug resolvido se não aconteceu. Como desafio complementar observável, imagens externas podem falhar; a interface possui alternativa visual para imagens que não carregam.

### 8. Conclusão e próximos passos — 1:00

**Texto na tela**

> **Aprendemos:** [aprendizado real da equipe]  
> **Próximos passos:** backup e migrações do banco · autenticação de produção · contato conectado a um serviço · gateway de pagamento · deploy

**Visual:** encerramento com a marca e uma trilha visual “protótipo atual → evolução futura”.

**Fala:** resumir a experiência e apresentar evoluções como possibilidades, não como funcionalidades já entregues. Convidar a banca a fazer perguntas.

## Notas técnicas para a fala

- Os itens da sacolinha são armazenados em SQLite no arquivo local `backend/data/ballykids.sqlite` e permanecem após reiniciar o backend.
- Os códigos de login são fixos e servem apenas à demonstração. O JWT protege as rotas durante o fluxo, mas isso não transforma o login em autenticação pronta para produção.
- A opção de pagamento, a confirmação de pedido e o formulário de contato são demonstrativos. Não há cobrança, envio real de mensagem nem integração com gateway.
- Não afirmar que existe deploy público, pagamento real ou fluxo Scrum/Kanban sem confirmar esses itens com a equipe.
- O README descreve como executar o projeto localmente. Antes da apresentação, confirmar que frontend e backend iniciam, testar o fluxo e manter a aplicação rodando.

## Plano B para a demonstração

- Abrir a aplicação localmente antes de começar e manter o terminal do frontend/backend disponível.
- Testar previamente login, catálogo, sacolinha e checkout demonstrativo.
- Deixar capturas de tela ou um vídeo curto do fluxo principal acessíveis offline.
- Se a conexão falhar, usar as capturas para explicar as telas; não depender de imagens externas para provar o funcionamento.
- Não mostrar arquivos `.env`, segredo JWT, token ativo ou informações pessoais.

## Prompt para uma ferramenta de criação de slides

Crie uma apresentação em português brasileiro, formato 16:9, para uma equipe apresentar em aproximadamente 10 minutos um projeto acadêmico chamado BellyKids, uma loja virtual demonstrativa de produtos para bebês e crianças pequenas. Siga a identidade observada no site: tons pastel de rosa, lilás, verde e amarelo, fundo creme, marca com ursinho/coração, formas arredondadas e visual acolhedor. Use pouco texto, títulos curtos, capturas reais da aplicação e diagramas simples. Organize em 8 slides: capa e propósito; necessidade e público; experiência e telas; arquitetura e tecnologias; equipe e versionamento; demo ao vivo; acessibilidade e desafio técnico; aprendizados e próximos passos. Deixe campos editáveis para nomes, papéis, turma, data, práticas de versionamento, desafio real e aprendizado da equipe. Não invente informações ausentes. Identifique claramente login, checkout, pagamento e contato como demonstrativos; não sugira banco de dados, cobrança, envio real de mensagens ou deploy existentes. Reserve cerca de 4 minutos para demonstração ao vivo, que será feita no navegador, e 3 a 5 minutos posteriores para perguntas.
