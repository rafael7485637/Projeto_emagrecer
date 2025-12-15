const { Pool } = require('pg');

// Configuração da conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: 'seu_usuario', // Substitua pelo seu usuário do PostgreSQL
  host: 'localhost',
  database: 'projeto_emagrecer', // Substitua pelo nome do seu banco
  password: 'sua_senha', // Substitua pela sua senha
  port: 5432,
});

module.exports = pool;
