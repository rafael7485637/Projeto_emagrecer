# Projeto Emagrecer

Aplicativo web para emagrecimento com vídeos, usuários e administradores.

## Instalação

1. Instale as dependências:
   ```
   npm install
   ```

2. Configure o banco de dados PostgreSQL:
   - Instale PostgreSQL.
   - Crie um banco de dados chamado `projeto_emagrecer`.
   - Execute o script SQL em `db/projeto_emagrecer.sql` para criar as tabelas.

3. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   DB_USER=seu_usuario
   DB_HOST=localhost
   DATABASE=projeto_emagrecer
   PASSWORD=sua_senha
   DB_PORT=5432
   JWT_SECRET=seu_secret_jwt
   ```

4. Inicie o servidor:
   ```
   npm start
   ```

O servidor rodará em http://localhost:3001.

## Funcionalidades

- Cadastro e login de usuários e administradores.
- Feed de vídeos categorizados.
- Player de vídeos com registro de visualizações.
- Administração: listar usuários, alterar status, cadastrar vídeos e admins.

## Estrutura do Projeto

- `index.js`: Servidor principal.
- `routes/`: Rotas da API.
- `src/`: DAOs e utilitários.
- `public/`: Arquivos estáticos (HTML, CSS, JS).
- `middlewares/`: Middlewares de autenticação.

Todas as funções foram analisadas e corrigidas para funcionar corretamente.</content>
<parameter name="filePath">c:\Users\xboxm\Downloads\Projeto_emagrecer\README.md
