require("dotenv").config();

// Middleware para proteger páginas (Redireciona para Login)
function auth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login"); // Em vez de .json(), enviamos para a página de login
  }
  next();
}

// Middleware para páginas restritas a Admin
function apenasAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.tipo !== "admin") {
    // Se logado mas não for admin, manda para o feed de vídeos
    return res.redirect("/feed_videos"); 
  }

  next();
}

// Middleware para páginas restritas a Usuários comuns
function apenasUsuario(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.tipo !== "usuario") {
    // Se for admin tentando acessar área de usuário, manda para lista de usuários
    return res.redirect("/lista_usuarios");
  }

  next();
}


module.exports = {
  auth,
  apenasAdmin,
  apenasUsuario,
};