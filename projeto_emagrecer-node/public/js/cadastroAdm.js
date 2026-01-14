   // Verificar se o usuário está logado
     const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
  }

   // Carregar navbar
        fetch("/components/navbar.html")
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

  const response = await fetch("/cadastrar-adm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(dados)
  });

  if (response.ok) {
    alert("Administrador cadastrado com sucesso!");
    window.location.href = "/";
  } else {
    alert(await response.text());
  }
});
