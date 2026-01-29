const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { auth, apenasAdmin } = require("../middlewares/auth");

const router = express.Router();

const pastaDietas = path.join(__dirname, "..", "public", "uploads", "dieta");

// garante que a pasta exista
if (!fs.existsSync(pastaDietas)) {
  fs.mkdirSync(pastaDietas, { recursive: true });
}

// storage → sempre substitui o arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaDietas);
  },
  filename: (req, file, cb) => {
    cb(null, "dieta-atual.pdf");
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Apenas PDF"));
    }
  }
});

// 🔐 somente admin
router.post(
  "/atualizar",
  auth,
  apenasAdmin,
  upload.single("pdf"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ erro: "Nenhum PDF enviado" });
    }

    res.json({
      sucesso: true,
      mensagem: "Dieta atualizada com sucesso"
    });
  }
);

module.exports = router;
