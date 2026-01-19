 // Carregar navbar
    fetch("/components/navbar_form.html")
        .then(r => r.text())
        .then(html => {
            document.getElementById("navbar").innerHTML = html;
        });


        
    document.getElementById("formCadastro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();

  if (foto.files[0]) {
    formData.append("foto", foto.files[0]);
  }

  formData.append("nome", nome.value);
  formData.append("gmail", gmail.value);
  formData.append("data_nascimento", data_nascimento.value);
  formData.append("peso", peso.value);
  formData.append("altura", altura.value);
  formData.append("telefone", telefone.value);
  formData.append("senha_usuario", senha_usuario.value);

  const response = await fetch("/api/users/cadastrar-usuario", {
    method: "POST",
    body: formData
  });

  if (response.ok) {
    alert("Cadastro realizado com sucesso!");
    window.location.href = "/contato";
  } else {
    alert(await response.text());
  }
});