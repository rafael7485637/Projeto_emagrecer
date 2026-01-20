const express = require("express");
const router = express.Router();
const LoginDAO = require("../src/LoginDAO");

// Login
router.post("/login", async (req, res) => {
  const { gmail, senha } = req.body;

  try {
    const loginDao = new LoginDAO();

    //  ADMIN
    const admin = await loginDao.buscarAdminPorEmail(gmail);
    if (admin) {
      const ok = await loginDao.validarSenha(senha, admin.senha_adm);
      if (!ok) {
        return res.status(401).json({ error: "Senha inválida" });
      }

      //  cria sessão
      req.session.user = {
        id: admin.idadministrador,
        tipo: "admin"
      };

      return res.json({ tipo: "admin" });
    }

    //  USUÁRIO
    const usuario = await loginDao.buscarUsuarioPorEmail(gmail);
    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    if (usuario.status !== "Pago") {
      return res.status(403).json({
        error: "Acesso negado. Conta não ativada.",
        redirect: "/contato"
      });
    }

    const ok = await loginDao.validarSenha(senha, usuario.senha_usuario);
    if (!ok) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    //  cria sessão
    req.session.user = {
      id: usuario.idusuario,
      tipo: "usuario"
    };

    res.json({ tipo: "usuario" });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro no login" });
  }

});

  //logout
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: "Erro ao sair" });
    }

    res.clearCookie("connect.sid");
    res.sendStatus(200);
  });
}); 


router.get("/me", (req, res) => {
    if (req.session && req.session.user) {
        // Se houver usuário na sessão, retorna os dados dele
        res.json(req.session.user);
    } else {
        // Se não houver, retorna erro 401
        res.status(401).json({ error: "Não autorizado" });
    }
});

 

module.exports = router;
