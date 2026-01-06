const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const VideosDAO = require("./assets/src/VideosDAO");
const CategoriaDAO = require("./assets/src/CategoriaDAO");
const UsuarioDAO = require("./assets/src/CadastroDAO");

const app = express();


// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (HTML, CSS, JS, uploads)
app.use(express.static(path.join(__dirname, "public")));


// Configuração do Multer para upload de imagens
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
  res.sendFile(path.join(__dirname, "public", "cadastroVideos.html"));
});

// Pagina de feed dos videos
app.get("/feed_videos", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "feed_videos.html"));
});

// =====================
// Rotas de API (Backend)
// =====================

// Cadastrar usuário
app.post("/cadastrar-usuario", async (req, res) => {
  const { nome, gmail, nascimento, cpf, peso, altura, telefone, endereco } = req.body;

  const dao = new UsuarioDAO();

  try {
    // Salvar no banco (validações ocorrem aqui)
    const usuario = await dao.salvar({ nome, gmail, nascimento, cpf, peso, altura, telefone, endereco });

    res.redirect("/");
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).send("Erro ao cadastrar usuário: " + error.message);
  }
});

//cadastra usuario
app.post("/cadastrar-usuario", async (req, res) => {
  const { nome, gmail, nascimento, CPF, peso, altura, telefone, endereco } = req.body;

  const dao = new VideosDAO();

  try {
    // Primeiro, salvar no banco (validações ocorrem aqui)
    const video = await dao.salvar({ titulo, descricao, link, imagem: null, idcategoria });

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

// Listar todos os vídeos ou filtrar por categoria
app.get("/videos", async (req, res) => {
  const dao = new VideosDAO();
  const { categoria } = req.query;

  try {
    let videos;
    if (categoria) {
      videos = await dao.listarPorCategoria(categoria);
    } else {
      videos = await dao.listarVideos();
    }
    res.json(videos);
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    res.status(500).json({ error: "Erro ao buscar vídeos" });
  }
});


// Buscar vídeo por ID para mostrar no player
app.get('/video/:id', async (req, res) => {
  const dao = new VideosDAO();
  const id = req.params.id;

  try {
    const video = await dao.buscarPorId(id);
    res.json(video);
  } catch (err) {
    res.status(404).json({ erro: 'Vídeo não encontrado' });
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

// Buscar vídeo por ID
app.get("/video/:id", async (req, res) => {
  const { id } = req.params;
  const dao = new VideosDAO();

  try {
    const video = await dao.buscarPorId(id);
    res.json(video);
  } catch (error) {
    console.error("Erro ao buscar vídeo:", error);
    res.status(500).json({ error: "Erro ao buscar vídeo: " + error.message });
  }
});

// Deletar vídeo por ID
app.delete("/videos/:id", async (req, res) => {
  const { id } = req.params;
  const dao = new VideosDAO();

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

