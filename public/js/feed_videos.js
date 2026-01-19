// 0. Define os elementos globais
const select = document.getElementById("selecionar-categoria"); 
const feed = document.getElementById("feed");


// Função para validar as respostas da API
async function checarResposta(res) {
    if (res.ok) return true;
    if (res.status === 401) {
        window.location.href = "index.html";
        return false;
    }
    console.error("Erro na requisição");
    return false;
}

let usuarioEAdmin = false;
// 1. Carregar a navbar
(async () => {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return;

    const user = await res.json();
    usuarioEAdmin = user.tipo === "admin"; //salva se é admin ou não
    const nav = document.getElementById("navbar");
    const navbarFile = user.tipo === "admin" ? "/components/navbar_adm.html" : "/components/navbar_usuario.html";

    const html = await fetch(navbarFile).then(r => r.text());
    nav.innerHTML = html;
  } catch (err) {
    console.error("Erro ao carregar navbar", err);
  }
})();

// 2. Carrega as categorias
async function carregarCategorias() {
    try {
        const res = await fetch('/api/videos/categorias', { credentials: "include" });
        
        // Agora a função existe e não dará erro!
        if (!(await checarResposta(res))) return;

        const categorias = await res.json();
        if (select) {
            categorias.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.idcategoria;
                opt.textContent = cat.nome;
                select.appendChild(opt);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }
}

//excluir video
async function excluirVideo(idvideo) {
  if (!confirm("Tem certeza que deseja excluir este vídeo?")) return;

  try {
    const res = await fetch(`/api/videos/${idvideo}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!(await checarResposta(res))) return;

    alert("Vídeo excluído com sucesso!");
    carregarVideos(select?.value || "");
  } catch (error) {
    console.error("Erro ao excluir vídeo:", error);
  }
}

// 3. Carrega os vídeos
async function carregarVideos(idcategoria = "") {
    let url = "/api/videos/videos-feed";
    if (idcategoria) url += `?idcategoria=${idcategoria}`;

    try {
        const res = await fetch(url, { credentials: "include" });
        if (!(await checarResposta(res))) return;

        const videos = await res.json();
        feed.innerHTML = "";

        if (videos.length === 0) {
            feed.innerHTML = "<p>Nenhum vídeo encontrado nesta categoria.</p>";
            return;
        }

        videos.forEach(video => {
            const card = document.createElement("div");
            card.className = "card";
            if (video.assistido) card.classList.add("assistido");

            card.innerHTML = `
                <img src="${video.imagem}" alt="${video.titulo}">
                <div class="card-content">
                    <h3>
                        ${video.titulo}
                        ${video.assistido ? "<span class='check'>✓</span>" : ""}
                    </h3>
                    <p>${video.descricao}</p>

                    <div class="card-actions">
                        <a href="/player?id=${video.idvideo}" class="btn-player">Ver vídeo</a>

                        ${usuarioEAdmin ? `<button class="btn-excluir" data-id="${video.idvideo}">Excluir</button>` : ""}
                    </div>
                </div>
            `;
            feed.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar vídeos:", error);
    }

    if (usuarioEAdmin) {
        document.querySelectorAll(".btn-excluir").forEach(btn => {
            btn.addEventListener("click", () => {
            excluirVideo(btn.dataset.id);
            });
        });
    }

}

// Eventos e Inicialização
if (select) {
    select.addEventListener('change', () => carregarVideos(select.value));
}

carregarCategorias();
carregarVideos();