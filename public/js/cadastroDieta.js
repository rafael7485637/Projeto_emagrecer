// Carregar navbar
fetch("/components/navbar_adm.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
    });

// Manipular envio do formulário
const form = document.getElementById("formCadastro");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const res = await fetch("/api/dieta/atualizar", {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao atualizar dieta");
      return;
    }

    alert("Dieta atualizada com sucesso!");
    form.reset();
  } catch (err) {
    console.error(err);
    alert("Erro no servidor");
  }
});
