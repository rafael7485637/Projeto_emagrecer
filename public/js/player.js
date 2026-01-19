// Carregar a navbar com base no tipo de usuário
(async () => {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include"
    });

    if (!res.ok) return;

    const user = await res.json();
    const nav = document.getElementById("navbar");

    const navbarFile =
      user.tipo === "admin"
        ? "/components/navbar_adm.html"
        : "/components/navbar_usuario.html";

    const html = await fetch(navbarFile).then(r => r.text());
    nav.innerHTML = html;

  } catch (err) {
    console.error("Erro ao carregar navbar", err);
  }
})();



const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let playerYT;
let visualizacaoRegistrada = false;

// 2. Registrar visualização (Agora via Sessão)
async function registrarVisualizacao() {
  if (visualizacaoRegistrada || !id) return;
  visualizacaoRegistrada = true;

  try {
    await fetch("/api/videos/registrar-visualizacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Envia o cookie da sessão para o Back saber quem é o usuário
      body: JSON.stringify({ idvideo: id })
    });
  } catch (err) {
    console.error("Erro ao registrar visualização", err);
  }
}

// 3. Carregar dados do vídeo
async function carregarVideo() {
  if (!id) {
    document.getElementById("player").innerHTML = "<p>Vídeo não encontrado.</p>";
    return;
  }

  try {
    const resposta = await fetch(`/api/videos/video/${id}`, {
      credentials: "include"
    });

    if (resposta.status === 401) {
      window.location.href = "/login";
      return;
    }

    const video = await resposta.json();

    document.getElementById("titulo").textContent = video.titulo;
    document.getElementById("descricao").textContent = video.descricao;

    const playerDiv = document.getElementById("player");
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = video.link.match(youtubeRegex);

    if (!match) {
      playerDiv.innerHTML = "<p>Link do YouTube inválido</p>";
      return;
    }

    const videoId = match[1];
    playerDiv.innerHTML = `<div id="yt-player"></div>`;

    if (window.YT && YT.Player) {
      criarPlayer(videoId);
    } else {
      window.onYouTubeIframeAPIReady = () => criarPlayer(videoId);
    }
  } catch (error) {
    console.error("Erro ao carregar vídeo:", error);
  }
}

function criarPlayer(videoId) {
  playerYT = new YT.Player("yt-player", {
    videoId: videoId,
    events: {
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  // YT.PlayerState.PLAYING indica que o vídeo começou
  if (event.data === YT.PlayerState.PLAYING) {
    registrarVisualizacao();
  }
}

carregarVideo();