const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require('bcrypt');
const CadastroDAO = require("../src/CadastroDAO");
const AdministradorDAO = require("../src/AdministradorDAO");
const { auth, apenasAdmin } = require("../middlewares/auth");

// Configuração do Multer para upload de fotos de usuários
const userPhotoDir = path.join(__dirname, "..", "public", "uploads", "foto");
if (!fs.existsSync(userPhotoDir)) {
  fs.mkdirSync(userPhotoDir, { recursive: true });
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

// Cadastrar usuário
router.post("/cadastrar-usuario", upload.single("foto"), async (req, res) => {
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
  try {
    // Verificar se o email já existe como administrador
    if (await dao.emailExisteComoAdm(gmail)) {
      return res.status(400).send("Email pertence a um administrador");
    }

    // Hash da senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha_usuario, saltRounds);

    // Salvar usuário
    const usuario = await dao.salvar({
      nome,
      gmail,
      data_nascimento,
      peso,
      altura,
      telefone,
      senha_usuario: senhaHash,
      foto: null
    });

    // Salvar foto se existir
    if (req.file) {
      const uniqueName = Date.now() + "-" + req.file.originalname;
      const filePath = path.join(userPhotoDir, uniqueName);
      fs.writeFileSync(filePath, req.file.buffer);
      const fotoPath = `/foto/${uniqueName}`;
      await dao.atualizarFoto(usuario.idusuario, fotoPath);
    }

    res.status(201).send("Usuário cadastrado");
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(400).send(error.message);
  }
});

// Listar usuários
router.get("/usuarios", auth, apenasAdmin, async (req, res) => {
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
router.put("/usuarios/:id/status", auth, apenasAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const dao = new CadastroDAO();

  try {
    await dao.atualizarStatus(id, status);
    res.json({ message: "Status atualizado" });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

// Cadastrar administrador
router.post("/cadastrar-adm", auth, apenasAdmin, async (req, res) => {
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
    console.error("Erro ao cadastrar administrador:", error);
    res.status(400).send(error.message);
  }
});

//excluir usuario
router.delete("/usuarios/:id", auth, apenasAdmin, async (req, res) => {
  const { id } = req.params;
  const dao = new CadastroDAO();
  try {
    await dao.excluirUsuario(id);
    res.json({ message: "Usuário excluído" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
});
module.exports = router;