const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const VideosDAO = require("../src/VideosDAO");
const CategoriaDAO = require("../src/CategoriaDAO");
const VisualizacaoDAO = require("../src/VisualizacaoDAO");
const { auth, apenasAdmin, apenasUsuario } = require("../middlewares/auth");
 const pool = require("../src/ConexaoBD");

// Configuração do Multer para upload de imagens de vídeos
const uploadDir = path.join(__dirname, "..", "public", "uploads", "imagem");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens são permitidas"));
    }
  }
});

// Cadastrar vídeo
router.post("/cadastrar-video", auth, apenasAdmin, upload.single('imagem'), async (req, res) => {
  const { titulo, descricao, link, idcategoria } = req.body;
  const dao = new VideosDAO();

  try {
    const video = await dao.salvar({ titulo, descricao, link, imagem: null, idcategoria });

    if (req.file) {
      const uniqueName = Date.now() + "-" + req.file.originalname;
      const filePath = path.join(uploadDir, uniqueName);
      fs.writeFileSync(filePath, req.file.buffer);
      const imagemPath = `/uploads/imagem/${uniqueName}`;
      await dao.atualizarImagem(video.idvideo, imagemPath);
    }

    res.status(200).json({ message: "Vídeo cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar vídeo:", error);
    res.status(500).send("Erro ao cadastrar vídeo: " + error.message);
  }
});

// Listar vídeos por categoria
router.get("/videos", async (req, res) => {
  const dao = new VideosDAO();
  const { idcategoria, nome } = req.query;

  try {
    const videos = await dao.listarPorCategoria(idcategoria, nome);
    res.json(videos);
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    res.status(500).json({ error: "Erro ao buscar vídeos" });
  }
});

// Buscar vídeo por ID
router.get("/video/:id", async (req, res) => {
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

// Listar categorias
router.get("/categorias", async (req, res) => {
  const dao = new CategoriaDAO();

  try {
    const categorias = await dao.listarCategorias();
    res.json(categorias);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});

// Deletar vídeo
router.delete("/:id", auth, apenasAdmin, async (req, res) => {
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

// Registrar visualização
router.post("/registrar-visualizacao", auth, apenasUsuario, async (req, res) => {
  const { idvideo } = req.body;
  const idusuario = req.session.user.id;
  const dao = new VisualizacaoDAO();

  try {
    await dao.registrar(idusuario, idvideo);
    res.sendStatus(201);
  } catch (error) {
    console.error("Erro ao registrar visualização:", error);
    res.status(500).json({ error: "Erro ao registrar visualização" });
  }
});

// Feed de vídeos com visualizações
// Feed de vídeos com visualizações
router.get("/videos-feed", auth, async (req, res) => {
  try {
    const { tipo, idusuario } = req.session.user;
    const { idcategoria, nome } = req.query; // Captura os dois parâmetros

    // Base da Query
   let sql;
   
    const params = [];

    if (tipo === "admin"){
      sql = `
        SELECT v.*, false AS assistido
        FROM video v
        WHERE 1=1
      `;
    }else{
      sql = `
        SELECT v.*,
        EXISTS (
          SELECT 1 FROM visualizacao vis
          WHERE vis.idvideo = v.idvideo
            AND vis.idusuario = $1
        ) AS assistido
        FROM video v
        WHERE 1=1
      `;
      params.push(idusuario);
    }
    
    // Filtro por Categoria
    if (idcategoria) {
      params.push(idcategoria);
      sql += ` AND v.idcategoria = $${params.length}`;
    }

    // Filtro por Nome (Busca)
    if (nome) {
      params.push(`%${nome}%`);
      sql += ` AND v.titulo ILIKE $${params.length}`;
    }

    sql += " ORDER BY v.idvideo DESC";

    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao carregar feed:", err);
    res.status(500).json({ erro: "Erro ao carregar feed" });
  }
});
module.exports = router;