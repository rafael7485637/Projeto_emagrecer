 // Verificar se o usuário está logado
    (async () => { 
        const res = await fetch("/api/auth/me", {
        credentials: "include"
    });
    if (!res.ok) {
        window.location.href = "/login";
    }
    })();

        // carregar navbar
        fetch("/components/navbar.html")
            .then(r => r.text())
            .then(html => {
            document.getElementById("navbar").innerHTML = html;
        });



        //carrega as categorias no select
        const select = document.getElementById('categoria');

        async function carregarCategorias() {
        const res = await fetch('/api/videos/categorias', {
            credentials: "include"
        });
        const categorias = await res.json();

        categorias.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.idcategoria;
            opt.textContent = cat.nome;
            select.appendChild(opt);
        });
        }

        //carrega os videos para mostrar no feed
        async function carregarVideos(idcategoria = "") {
        let url = "/api/videos/videos-feed";

        if (idcategoria) {
            url += `?idcategoria=${idcategoria}`;
        }

        const res = await fetch(url, {
            credentials: "include"
        });

        if (!res.ok) {
            console.error("Erro HTTP:", res.status);
            return;
        }

        const videos = await res.json();

        const feed = document.getElementById("feed");
        feed.innerHTML = "";

        videos.forEach(video => {
            const card = document.createElement("div");
            card.className = "card";

            if (video.assistido) {
            card.classList.add("assistido");
            }

            card.innerHTML = `
            <img src="${video.imagem}" alt="${video.titulo}">
            <div class="card-content">
                <h3>
                    ${video.titulo}
                    ${video.assistido ? "<span class='check'>✓</span>" : ""}
                </h3>
                <p>${video.descricao}</p>
                <a href="/player?id=${video.idvideo}">Ver vídeo</a>
            </div>
            `;

            feed.appendChild(card);
        });
        }
        




        select.addEventListener('change', () => {
        carregarVideos(select.value);
        });

        

        carregarCategorias();
        carregarVideos();