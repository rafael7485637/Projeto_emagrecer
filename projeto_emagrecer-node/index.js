const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const fs = require("fs");
const multer = require('multer');
require("dotenv").config();


const app = express();

// Rotas
const userRoutes = require("./routes/users");
const videoRoutes = require("./routes/videos");
const authRoutes = require("./routes/auth");

// Middlewares de segurança
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limitar tamanho do JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir fotos de usuários
app.use("/foto", express.static(path.join(__dirname, "public", "foto")));


// Servir arquivos estáticos (HTML, CSS, JS, uploads)
app.use(express.static(path.join(__dirname, "public")));

// Usar rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);


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


// =====================
// Rotas de API (Backend)
// =====================

// =====================
// Inicialização do servidor
// =====================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

