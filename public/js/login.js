// CARREGAR NAVBAR 
fetch("/components/navbar_form.html")
  .then(r => r.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
  });

  //verifica cookies de sessão e redireciona se necessário
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        
        if (res.ok) {
            const user = await res.json();
            // Se o servidor respondeu OK, o usuário já está logado!
            // Redireciona conforme o tipo
            if (user.tipo === "admin") {
                window.location.href = "/lista_usuarios";
            } else {
                window.location.href = "/feed_videos";
            }
        }
    } catch (err) {
        console.log("Nenhuma sessão ativa.");
    }
});

// LOGIN
const formLogin = document.getElementById("formLogin");

if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gmail = document.getElementById("gmail").value;
    const senha = document.getElementById("senha").value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Permite receber o cookie connect.sid
        body: JSON.stringify({ gmail, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao fazer login");
        if (data.redirect) window.location.href = data.redirect;
        return;
      }

      // --- LIMPEZA DO SISTEMA ANTIGO ---
      // Remove tokens antigos para evitar confusão no front-end
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // --- REDIRECIONAMENTO ---
      // O servidor já enviou o cookie, agora só navegamos
      if (data.tipo === "admin") {
        window.location.href = "/lista_usuarios";
      } else {
        window.location.href = "/feed_videos";
      }

    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });
}