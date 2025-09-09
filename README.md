# Riot Search API - Backend

🎮 API backend para consulta de dados de jogadores do League of Legends utilizando a API oficial da Riot Games.

## 📋 Funcionalidades

- **Busca de Jogadores**: Pesquisa por Game Name + Tag Line
- **Histórico de Partidas**: Últimas 10 partidas do jogador
- **Ranking**: Informações de ranking atual (Solo/Duo, Flex)
- **Spectate**: Verificar se o jogador está em partida ao vivo
- **Documentação Swagger**: Interface interativa para testar endpoints

## 🛠️ Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Axios** - Cliente HTTP para API da Riot
- **Swagger UI** - Documentação interativa
- **CORS** - Configuração para frontend
- **dotenv** - Gerenciamento de variáveis de ambiente

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- NPM ou Yarn
- Chave da API da Riot Games

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd riot-search-api-ts
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas configurações:

```env
PORT=3333
API_KEY=sua_chave_da_riot_api_aqui
```

### 4. Obtenha sua chave da API da Riot

1. Acesse [Riot Developer Portal](https://developer.riotgames.com/)
2. Faça login com sua conta da Riot
3. Gere uma chave de desenvolvimento
4. Adicione a chave no arquivo `.env`

### 5. Execute o projeto

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build
```

## 📚 Documentação da API

Após iniciar o servidor, acesse a documentação Swagger em:

```
http://localhost:3333/api-docs
```

## 🔗 Endpoints Principais

### Buscar Jogador
```
GET /api/league/searchUser/:name/:tag
```

### Histórico de Partidas
```
GET /api/league/searchMatchs/:puuid
```

### Ranking do Jogador
```
GET /api/league/getRankProfile/:puuid
```

### Spectate (Jogo Atual)
```
GET /api/league/spectateGame/:puuid
```

## 📁 Estrutura do Projeto

```
src/
├── Controllers/          # Controladores das rotas
│   └── leagueController.ts
├── Errors/               # Classes de erro customizadas
│   └── AppError.ts
├── Routes/               # Definição das rotas
│   ├── index.ts
│   └── league.routes.ts
├── service/              # Serviços externos (API Riot)
│   ├── apiRiot.ts
│   └── routesRiotApi.ts
├── server.ts             # Configuração do servidor
└── swagger.json          # Documentação Swagger
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run vercel-build` - Build para deploy no Vercel

## 🌐 Deploy

O projeto está configurado para deploy no Vercel. Certifique-se de:

1. Configurar as variáveis de ambiente no painel do Vercel
2. Adicionar sua `API_KEY` da Riot Games
3. O arquivo `vercel.json` já está configurado

## ⚠️ Limitações da API

- **Rate Limits**: A API da Riot tem limites de requisições
- **Chave de Desenvolvimento**: Válida por 24 horas
- **Região**: Configurada para Brasil (BR1)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Thiago Torres de Souza**
- Email: thiagomev@gmail.com

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!