const express = require('express');
const app = express();

// Permite usar HTML estático
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Meu site Node.js está funcionando!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
