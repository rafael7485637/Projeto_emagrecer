const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require('bcrypt'); // ou 'bcryptjs'
require("dotenv").config();

const VideosDAO = require("./assets/src/VideosDAO");
const CategoriaDAO = require("./assets/src/CategoriaDAO");
const CadastroDAO = require("./assets/src/CadastroDAO");
const AdministradorDAO = require("./assets/src/AdministradorDAO");
const LoginDAO = require("./assets/src/LoginDAO");
const app = express();
const { auth, apenasAdmin, apenasUsuario } = require("./middlewares/auth");


// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir fotos de usuários
app.use("/foto", express.static(path.join(__dirname, "public", "foto")));


// Servir arquivos estáticos (HTML, CSS, JS, uploads)
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

//carregar componentes
app.use("/components", express.static(path.join(__dirname, "assets", "components")));

// Configuração do Multer para upload de imagens
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//Configuração do Multer para upload de fotos de usuários
const userPhotoDir = path.join(__dirname, "public", "foto");

if (!fs.existsSync(userPhotoDir)) {
  fs.mkdirSync(userPhotoDir, { recursive: true });
}


// Usar memory storage para controlar quando salvar a imagem (apenas após validações)
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

//proteger rotas 
  //somente admin
  app.get("/cadastroAdm", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cadastroAdm.html"));
  });

  app.get("/cadastroVideos", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cadastroVideos.html"));
  });

  app.get("/lista_usuarios", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "lista_usuarios.html"));
  });

  //somente usuario
  app.get("/feed_videos", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "feed_videos.html"));
  });

  //publico
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
  });

  app.get("/cadastro", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cadastro.html"));
  });
  app.get("/contato", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "contato.html"));
  });

// =====================
// Rotas de API (Backend)
// =====================

// Cadastrar usuário
app.post("/cadastrar-usuario", upload.single("foto"), async (req, res) => {

  const {
    nome,
    gmail,
    data_nascimento,
    peso,
    altura,
    telefone,
    senha_usuario
  } = req.body;

  const dao = new CadastroDAO();
  try{
    //quantidade de criptografia do hash
    const saltRounds = 10;
    //gerar o hash da senha
    const senhaHash = await bcrypt.hash(senha_usuario, saltRounds);
    //salva no banco a senha com hash
    const usuario =await dao.salvar({
    nome,
    gmail,
    data_nascimento,
    peso,
    altura,
    telefone,
    senha_usuario: senhaHash,
    foto: null
    });

    // 2️⃣ Se existir foto, salva no disco e atualiza banco
    if (req.file) {
      const uniqueName = Date.now() + "-" + req.file.originalname;
      const filePath = path.join(userPhotoDir, uniqueName);

      fs.writeFileSync(filePath, req.file.buffer);

      const fotoPath = `/foto/${uniqueName}`;
      await dao.atualizarFoto(usuario.idusuario, fotoPath);
    }
    if (await dao.emailExisteComoAdm(gmail)) {
      return res.status(400).send("Email pertence a um administrador");
    }

    res.status(201).send("Usuário cadastrado");

  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});


// Listar usuários
app.get("/usuarios", auth, apenasAdmin, async (req, res) => {
  const dao = new CadastroDAO();

  try {
    const usuarios = await dao.listarUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

// Atualizar status do usuário
app.put("/usuarios/:id/status", auth, apenasAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const dao = new CadastroDAO();

  try {
    await dao.atualizarStatus(id, status);
    res.json({ message: "Status atualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

// cadastrar administrador
app.post("/cadastrar-adm", auth, apenasAdmin, async (req, res) => {
  const { nome_adm, gmail_adm, senha_adm } = req.body;
  const dao = new AdministradorDAO();

  try {
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha_adm, saltRounds);

    await dao.salvar({
      nome_adm,
      gmail_adm,
      senha_adm: senhaHash
    });

    res.status(201).send("Administrador cadastrado");

  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});


// Cadastrar vídeo
app.post("/cadastrar-video", auth, apenasAdmin, upload.single('imagem'), async (req, res) => {
  const { titulo, descricao, link, idcategoria } = req.body;

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
app.get("/videos", auth, apenasUsuario, async (req, res) => {
  const dao = new VideosDAO();
  const { idcategoria } = req.query;

  try {
    const videos = await dao.listarPorCategoria(idcategoria);
    res.json(videos);
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    res.status(500).json({ error: "Erro ao buscar vídeos" });
  }
});

// Buscar vídeo por ID para mostrar no player
app.get("/video/:id", auth, apenasUsuario, async (req, res) => {
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
app.delete("/videos/:id", auth, apenasAdmin, async (req, res) => {
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

//login
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

app.post("/login", async (req, res) => {
  const { gmail, senha } = req.body;

  try {
    const loginDao = new LoginDAO();

    // 🔎 1. ADMIN
    const admin = await loginDao.buscarAdminPorEmail(gmail);

    if (admin) {
      const ok = await loginDao.validarSenha(senha, admin.senha_adm);

      if (!ok) {
        return res.status(401).json({ error: "Senha inválida" });
      }

      const token = jwt.sign(
        { id: admin.idadministrador, tipo: "admin" },
        SECRET,
        { expiresIn: "1d" }
      );

      return res.json({ tipo: "admin", token });
    }

    // 🔎 2. USUÁRIO
    const usuario = await loginDao.buscarUsuarioPorEmail(gmail);

    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado ou não autorizado" });
    }

    const ok = await loginDao.validarSenha(senha, usuario.senha_usuario);

    if (!ok) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: usuario.idusuario, tipo: "usuario" },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({ tipo: "usuario", token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no login" });
  }
});

// =====================
// Inicialização do servidor
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

