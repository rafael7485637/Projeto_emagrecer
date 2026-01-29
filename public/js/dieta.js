// CARREGAR NAVBAR 
fetch("/components/navbar_adm.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
    });