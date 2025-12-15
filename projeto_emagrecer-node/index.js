const express = require('express');
const pool = require('./assets/src/ConexaoBD');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Permite usar HTML estático
app.use(express.static('public'));

// Rota inicial
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Rota para criar um novo usuário
app.post('/usuario', async (req, res) => {
  const { nome, idade, altura } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, idade, altura) VALUES ($1, $2, $3) RETURNING id',
      [nome, idade, altura]
    );
    res.status(201).json({ id: result.rows[0].id, message: 'Usuário criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Rota para adicionar peso a um usuário
app.post('/peso', async (req, res) => {
  const { usuario_id, peso, data } = req.body;
  try {
    await pool.query(
      'INSERT INTO pesos (usuario_id, peso, data) VALUES ($1, $2, $3)',
      [usuario_id, peso, data || new Date()]
    );
    res.status(201).json({ message: 'Peso adicionado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar peso' });
  }
});

// Rota para calcular IMC de um usuário (baseado no último peso)
app.get('/imc/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await pool.query('SELECT altura FROM usuarios WHERE id = $1', [id]);
    const peso = await pool.query(
      'SELECT peso FROM pesos WHERE usuario_id = $1 ORDER BY data DESC LIMIT 1',
      [id]
    );
    if (usuario.rows.length === 0 || peso.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário ou peso não encontrado' });
    }
    const altura = usuario.rows[0].altura / 100; // em metros
    const imc = peso.rows[0].peso / (altura * altura);
    res.json({ imc: imc.toFixed(2) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao calcular IMC' });
  }
});

// Rota para listar pesos de um usuário
app.get('/pesos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT peso, data FROM pesos WHERE usuario_id = $1 ORDER BY data DESC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pesos' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
