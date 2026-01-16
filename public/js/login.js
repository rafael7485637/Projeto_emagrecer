// VERIFICA SESSÃO
(async () => {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json();

      if (data.tipo === "admin") {
        window.location.href = "/lista_usuarios";
      } else {
        window.location.href = "/feed_videos";
      }
    }
  } catch (err) {
    console.log("Usuário não autenticado");
  }
})();


// CARREGAR NAVBAR + LOGOUT
fetch("/components/navbar_form.html")
  .then(r => r.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;

    //  AGORA o botão existe
    const btnLogout = document.getElementById("btnLogout");

    if (btnLogout) {
      btnLogout.addEventListener("click", async (e) => {
        e.preventDefault();

        const certeza = confirm("Você tem certeza que deseja sair?");
        if (!certeza) return;

        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include"
        });

        window.location.href = "/index.html";
      });
    }
  });


// LOGIN
const formLogin = document.getElementById("formLogin");

if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gmail = document.getElementById("gmail").value;
    const senha = document.getElementById("senha").value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ gmail, senha })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      if (data.redirect) window.location.href = data.redirect;
      return;
    }

    if (data.tipo === "admin") {
      window.location.href = "/lista_usuarios";
    } else {
      window.location.href = "/feed_videos";
    }
  });
}
