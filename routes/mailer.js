const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const LoginDAO = require("../src/LoginDAO");
const RecoveryDAO = require("../src/RecoveryDAO");

const recoveryDao = new RecoveryDAO();
const loginDao = new LoginDAO();

// configurar o nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔁 RECUPERAR SENHA
router.post("/forgot-password", async (req, res) => {
  const { gmail } = req.body;

  try {
    const user = await loginDao.buscarUsuarioPorEmail(gmail);

    if (!user) {
      return res.json({
        message: "Verifique seu e-mail."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expira = Date.now() + 60 * 60 * 1000;

    await recoveryDao.salvarToken(user.idusuario, tokenHash, expira);

    const linkRecuperacao =
      `http://localhost:3001/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: gmail,
      subject: "Recuperação de senha",
      html: `
        <p>Você solicitou a redefinição de senha.</p>
        <p>Clique no link abaixo (válido por 1 hora):</p>
        <a href="${linkRecuperacao}">${linkRecuperacao}</a>
      `
    });

    res.json({ message: "E-mail de recuperação enviado!" });

  } catch (err) {
    console.error("ERRO FORGOT:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// 🔑 RESETAR SENHA
router.post("/reset-password", async (req, res) => {
  try {
    const { token, novaSenha } = req.body;

    if (!novaSenha || novaSenha.length < 8) {
      return res.status(400).json({
        error: "A senha deve ter no mínimo 8 caracteres"
      });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const usuario = await recoveryDao.buscarUsuarioPorToken(tokenHash);
    if (!usuario) {
      return res.status(400).json({
        error: "Token inválido ou expirado"
      });
    }

    const senhaIgual = await bcrypt.compare(
      novaSenha,
      usuario.senha_usuario
    );

    if (senhaIgual) {
      return res.status(400).json({
        error: "Use uma senha diferente da anterior"
      });
    }

    const hashSenha = await bcrypt.hash(novaSenha, 10);
    await recoveryDao.atualizarSenha(usuario.idusuario, hashSenha);

    res.json({ message: "Senha alterada com sucesso!" });

  } catch (err) {
    console.error("ERRO RESET:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

module.exports = router;
