    const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
  }

  // Carregar navbar
  fetch("/components/navbar.html")
    .then(r => r.text())
    .then(html => {
      document.getElementById("navbar").innerHTML = html;
    });

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let playerYT;
  let visualizacaoRegistrada = false;

  async function registrarVisualizacao() {
    if (visualizacaoRegistrada) return;

    visualizacaoRegistrada = true;

    try {
      await fetch("/registrar-visualizacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ idvideo: id })
      });
    } catch (err) {
      console.error("Erro ao registrar visualização", err);
    }
  }

  async function carregarVideo() {
    const resposta = await fetch(`/video/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const video = await resposta.json();

    document.getElementById("titulo").textContent = video.titulo;
    document.getElementById("descricao").textContent = video.descricao;

    const playerDiv = document.getElementById("player");

    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

    const match = video.link.match(youtubeRegex);

    if (!match) {
      playerDiv.innerHTML = "<p>Vídeo inválido</p>";
      return;
    }

    const videoId = match[1];

    playerDiv.innerHTML = `<div id="yt-player"></div>`;

    window.onYouTubeIframeAPIReady = function () {
      playerYT = new YT.Player("yt-player", {
        height: "315",
        width: "560",
        videoId: videoId,
        events: {
          onStateChange: onPlayerStateChange
        }
      });
    };
  }

  function onPlayerStateChange(event) {
    // PLAY
    if (event.data === YT.PlayerState.PLAYING) {
      registrarVisualizacao();
    }
  }

  carregarVideo();