// CARREGAR NAVBAR
fetch("/components/navbar_adm.html")
  .then(r => r.text())
  .then(html => {
    const navbar = document.getElementById("navbar");
    navbar.innerHTML = html;

    // 🔥 depois de carregar o navbar:
    setActiveMenu();
  });

function setActiveMenu() {
  // remove active de todos
  const links = document.querySelectorAll(".sidebar a");
  links.forEach(link => link.classList.remove("active"));

  // aplica active somente no Dieta
  const dietaLink = document.querySelector('.sidebar a[href="/dieta"]');
  if (dietaLink) {
    dietaLink.classList.add("active");
  }
}

let usuarioEAdmin = false;

// 1️⃣ Carregar navbar conforme tipo de usuário
(async () => {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return;

    const user = await res.json();
    usuarioEAdmin = user.tipo === "admin";

    const navbarFile = usuarioEAdmin
      ? "/components/navbar_adm.html"
      : "/components/navbar_usuario.html";

    const nav = document.getElementById("navbar");
    const html = await fetch(navbarFile).then(r => r.text());
    nav.innerHTML = html;

    // ⚡ depois que o navbar entra no DOM
    setActiveMenu();

  } catch (err) {
    console.error("Erro ao carregar navbar", err);
  }
})();

