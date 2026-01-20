// CARREGAR NAVBAR 
fetch("/components/navbar_form.html")
  .then(r => r.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
  });

  

  document.getElementById('resetForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Pegar o token da URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  const novaSenha = document.getElementById('novaSenha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;
  const msg = document.getElementById('msg');

  if (novaSenha !== confirmarSenha) {
    return msg.innerText = "As senhas não coincidem!";
  }

  try {
    const response = await fetch('/api/mailer/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, novaSenha })
    });
    
    const data = await response.json();
    if (response.ok) {
      alert("Senha alterada! Você será redirecionado para o login.");
      window.location.href = "/login";
    } else {
      msg.innerText = data.error;
    }
  } catch (err) {
    msg.innerText = "Erro ao processar sua senha.";
  }
});