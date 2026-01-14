// Carregar navbar
    fetch("/components/navbar_form.html")
        .then(r => r.text())
        .then(html => {
            document.getElementById("navbar").innerHTML = html;
        });



    document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const gmail = document.getElementById("gmail").value;
    const senha = document.getElementById("senha").value;

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail, senha })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.error);
        if (data.redirect) {
            window.location.href = data.redirect;
        }
        return;
    }

    localStorage.setItem("token", data.token);

    if (data.tipo === "admin") {
        window.location.href = "/lista_usuarios";
    } else {
        window.location.href = "/feed_videos";
    }
    });