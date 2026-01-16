require("dotenv").config();

function auth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  next();
}

function apenasAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  if (req.session.user.tipo !== "admin") {
    return res.status(403).json({ error: "Acesso negado" });
  }

  next();
}

function apenasUsuario(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  if (req.session.user.tipo !== "usuario") {
    return res.status(403).json({ error: "Acesso negado" });
  }

  next();
}

function usuarioEAadm(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  if (!["usuario", "admin"].includes(req.session.user.tipo)) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  next();
}

module.exports = {
  auth,
  apenasAdmin,
  apenasUsuario,
  usuarioEAadm
};
