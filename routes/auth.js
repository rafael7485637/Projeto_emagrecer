const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config();
const LoginDAO = require("../src/LoginDAO");

const SECRET = process.env.JWT_SECRET;

// Login
router.post("/login", async (req, res) => {
  const { gmail, senha } = req.body;

  try {
    const loginDao = new LoginDAO();

    // Tentar login como admin
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

    // Tentar login como usuário
    const usuario = await loginDao.buscarUsuarioPorEmail(gmail);
    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado ou não autorizado" });
    }

    if (usuario.status !== 'Pago') {
      return res.status(403).json({ error: "Acesso negado. Conta não ativada.", redirect: "/contato" });
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
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro no login" });
  }
});

module.exports = router;