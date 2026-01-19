 // Carregar navbar
fetch("/components/navbar_adm.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
    });



   document.getElementById("formCadastro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    nome_adm: document.getElementById("nome_adm").value,
    gmail_adm: document.getElementById("gmail_adm").value,
    senha_adm: document.getElementById("senha_adm").value
  };

  try {
      const response = await fetch("/api/users/cadastrar-adm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
        credentials: "include"
      });

      if (response.ok) {
        alert("Administrador cadastrado com sucesso!");
        window.location.href = "/";
      } else if (response.status === 401 || response.status === 403) {
                // Caso a sessão tenha expirado ou o usuário não seja admin
                alert("Sessão expirada ou acesso negado. Faça login novamente.");
                window.location.href = "/login";
      } else {
          const erroMsg = await response.text();
          alert("Erro: " + erroMsg);
      }
  } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o servidor.");
  }
});
