//logut
document.addEventListener("click", async (e) => {
  if (e.target && e.target.id === "btnLogout") { // Verifica se o elemento clicado é o botão de logout
    e.preventDefault();

    if (!confirm("Deseja realmente sair?")) return;

    try { // Tenta fazer a requisição de logout
      const res = await fetch("/api/auth/logout", {
        method: "POST", // Método para enviar a requisição de logout
        credentials: "include"// Incluir cookies na requisição
      });

    if (res.ok) { // Verifica se a resposta foi bem-sucedida
      window.location.href = "/index.html"; // Redireciona para a página inicial
    }
  } catch (err) {
      console.error("Erro ao fazer logout:", err); // Loga o erro no console
    }
  }
});