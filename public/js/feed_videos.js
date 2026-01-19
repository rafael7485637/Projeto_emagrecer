// 1. Carregar navbar
fetch("/components/navbar.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
    });

const select = document.getElementById('categoria');

// Função auxiliar para verificar se a sessão ainda é válida
async function checarResposta(res) {
    if (res.status === 401) {
        // Se o back-end retornar 401, a sessão expirou
        window.location.href = "/login";
        return false;
    }
    return res.ok;
}

// 2. Carrega as categorias no select
async function carregarCategorias() {
    try {
        const res = await fetch('/api/videos/categorias', {
            credentials: "include"
        });

        if (!(await checarResposta(res))) return;

        const categorias = await res.json();
        categorias.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.idcategoria;
            opt.textContent = cat.nome;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }
}

// 3. Carrega os vídeos para mostrar no feed
async function carregarVideos(idcategoria = "") {
    let url = "/api/videos/videos-feed";
    if (idcategoria) {
        url += `?idcategoria=${idcategoria}`;
    }

    try {
        const res = await fetch(url, {
            credentials: "include"
        });

        if (!(await checarResposta(res))) return;

        const videos = await res.json();
        const feed = document.getElementById("feed");
        feed.innerHTML = "";

        if (videos.length === 0) {
            feed.innerHTML = "<p>Nenhum vídeo encontrado nesta categoria.</p>";
            return;
        }

        videos.forEach(video => {
            const card = document.createElement("div");
            card.className = "card";

            if (video.assistido) {
                card.classList.add("assistido");
            }

            // Dica: Use a rota /player que você definiu no back-end
            card.innerHTML = `
                <img src="${video.imagem}" alt="${video.titulo}">
                <div class="card-content">
                    <h3>
                        ${video.titulo}
                        ${video.assistido ? "<span class='check'>✓</span>" : ""}
                    </h3>
                    <p>${video.descricao}</p>
                    <a href="/player?id=${video.idvideo}" class="btn-player">Ver vídeo</a>
                </div>
            `;
            feed.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar vídeos:", error);
    }
}

// Eventos
select.addEventListener('change', () => {
    carregarVideos(select.value);
});

// Inicialização
carregarCategorias();
carregarVideos();