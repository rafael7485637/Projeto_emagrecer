// CARREGAR NAVBAR 
fetch("/components/navbar_form.html")
  .then(r => r.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
  });

document.getElementById('forgotForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const gmail = document.getElementById('gmail').value;
  const msg = document.getElementById('msg');

  try {
    const response = await fetch('/api/mailer/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gmail })
    });
    const data = await response.json();
    msg.innerText = data.message || data.error;
  } catch (err) {
    msg.innerText = "Erro ao conectar com o servidor.";
  }
});