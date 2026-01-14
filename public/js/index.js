 // Carregar navbar
    fetch("/components/navbar_index.html")
        .then(r => r.text())
        .then(html => {
            document.getElementById("navbar").innerHTML = html;
        });