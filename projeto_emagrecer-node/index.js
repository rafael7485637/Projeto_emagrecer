const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const CadastroDAO = require("./assets/src/CadastroDAO");
const CategoriaDAO = require("./assets/src/CategoriaDAO");

const app = express();

// =====================
// Middlewares básicos
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (HTML, CSS, JS, uploads)
app.use(express.static(path.join(__dirname, "public")));

// =====================
// Configuração do Multer para upload de imagens
// =====================
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Usar memory storage para controlar quando salvar a imagem (apenas após validações)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// =====================
// Rotas de páginas (Frontend)
// =====================

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Página de cadastro de vídeo
app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cadastro.html"));
});

// =====================
// Rotas de API (Backend)
// =====================

// Cadastrar vídeo
app.post("/cadastrar-video", upload.single("imagem"), async (req, res) => {
  const { titulo, descricao, url } = req.body;

  const dao = new CadastroDAO();

  try {
    // Primeiro, salvar no banco (validações ocorrem aqui)
    const video = await dao.salvar({ titulo, descricao, url, imagem: null });

    // Se cadastro ok, salvar a imagem no disco se existir
    if (req.file) {
      const uniqueName = Date.now() + "-" + req.file.originalname;
      const filePath = path.join(uploadDir, uniqueName);
      fs.writeFileSync(filePath, req.file.buffer);
      const imagemPath = `/uploads/${uniqueName}`;
      // Atualizar o registro com o caminho da imagem
      await dao.atualizarImagem(video.idvideo, imagemPath);
    }

    res.redirect("/");
  } catch (error) {
    console.error("Erro ao cadastrar vídeo:", error);
    res.status(500).send("Erro ao cadastrar vídeo: " + error.message);
  }
});

// Listar todos os vídeos
app.get("/videos", async (req, res) => {
  const dao = new CadastroDAO();

  try {
    const videos = await dao.listarVideos();
    res.json(videos);
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    res.status(500).json({ error: "Erro ao buscar vídeos" });
  }
});

// Listar categorias
app.get("/categorias", async (req, res) => {
  const dao = new CategoriaDAO();

  try {
    const categorias = await dao.listarCategorias();
    res.json(categorias);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});

// Deletar vídeo por ID
app.delete("/videos/:id", async (req, res) => {
  const { id } = req.params;
  const dao = new CadastroDAO();

  try {
    await dao.deletar(id);
    res.json({ message: "Vídeo deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar vídeo:", error);
    res.status(500).json({ error: "Erro ao deletar vídeo: " + error.message });
  }
});

// =====================
// Inicialização do servidor
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
