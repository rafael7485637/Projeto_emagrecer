# Projeto Emagrecer - Backend Node.js

Este é o backend para o projeto de emagrecimento, desenvolvido com Node.js, Express e PostgreSQL.

## Funcionalidades

- Cadastro e login de usuários e administradores
- Gerenciamento de vídeos por categoria
- Sistema de visualizações
- Upload de imagens para vídeos e fotos de perfil
- Autenticação JWT
- Autorização baseada em roles (usuário/admin)

## Tecnologias

- Node.js
- Express.js
- PostgreSQL
- JWT para autenticação
- Multer para upload de arquivos
- bcrypt para hash de senhas
- Helmet para segurança

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados PostgreSQL e crie as tabelas usando o script em `assets/BD/projeto_emagrecer.sql`

4. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   JWT_SECRET=seu_segredo_jwt
   DB_USER=seu_usuario_db
   DB_HOST=localhost
   DATABASE=projeto_emagrecer
   PASSWORD=sua_senha_db
   PORT=5432
   ```

5. Execute o servidor:
   ```bash
   npm run dev
   ```

O servidor estará rodando em `http://localhost:3001`

## Estrutura do Projeto

- `index.js`: Arquivo principal do servidor
- `routes/`: Rotas organizadas por funcionalidade
  - `auth.js`: Rotas de autenticação
  - `users.js`: Rotas de usuários e administradores
  - `videos.js`: Rotas de vídeos e categorias
- `middlewares/`: Middlewares de autenticação
- `assets/src/`: DAOs (Data Access Objects) para interação com o banco
- `public/`: Arquivos estáticos (HTML, CSS, JS, uploads)

## Melhorias Implementadas

- Estrutura modular com rotas separadas
- Validações de entrada robustas
- Tratamento de erros melhorado
- Segurança com Helmet
- Limitação de tamanho de payload
- Sanitização de dados
- Verificações de unicidade de email

## API Endpoints

### Autenticação
- `POST /login`: Login de usuário/admin

### Usuários
- `POST /cadastrar-usuario`: Cadastrar usuário
- `GET /usuarios`: Listar usuários (admin)
- `PUT /usuarios/:id/status`: Atualizar status do usuário (admin)
- `POST /cadastrar-adm`: Cadastrar administrador (admin)

### Vídeos
- `POST /cadastrar-video`: Cadastrar vídeo (admin)
- `GET /videos`: Listar vídeos (usuário)
- `GET /video/:id`: Buscar vídeo por ID (usuário)
- `DELETE /videos/:id`: Deletar vídeo (admin)
- `GET /categorias`: Listar categorias
- `POST /registrar-visualizacao`: Registrar visualização (usuário)
- `GET /videos-feed`: Feed de vídeos com status de visualização (usuário)

## Segurança

- Senhas hasheadas com bcrypt
- Tokens JWT com expiração
- Validação de tipos MIME para uploads
- Sanitização de strings
- Limitação de tamanho de arquivos
- Headers de segurança com Helmet

## Desenvolvimento

Para contribuir:
1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto está sob a licença ISC.