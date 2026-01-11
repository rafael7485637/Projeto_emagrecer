const jwt = require("jsonwebtoken");
const SECRET = "segredo_super_importante";

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

function apenasAdmin(req, res, next) {
  if (req.user.tipo !== "admin") {
    return res.status(403).json({ error: "Acesso negado" });
  }
  next();
}

function apenasUsuario(req, res, next) {
  if (req.user.tipo !== "usuario") {
    return res.status(403).json({ error: "Acesso negado" });
  }
  next();
}

module.exports = { auth, apenasAdmin, apenasUsuario };
