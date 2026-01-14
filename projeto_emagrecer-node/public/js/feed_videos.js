 // Verificar se o usuário está logado
          const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
            }

        //conectar nos componentes 

        // carregar navbar
        fetch("/components/navbar.html")
            .then(r => r.text())
            .then(html => {
            document.getElementById("navbar").innerHTML = html;
        });

        const select = document.getElementById('categoria');

        async function carregarCategorias() {
        const res = await fetch('/categorias', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
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
        async function carregarVideos(idcategoria = '') {
        const url = idcategoria ? `/videos?idcategoria=${idcategoria}` : '/videos';

        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const videos = await res.json();

        const feed = document.getElementById('feed');
        feed.innerHTML = '';

        videos.forEach(video => {
            const card = document.createElement('div');
            card.className = 'card';

            if (video.assistido) {
                card.classList.add('assistido');
            }

            card.innerHTML = `
            <img src="${video.imagem || 'placeholder.jpg'}" alt="${video.titulo}">
            <div class="card-content">
                <h3>${video.titulo}</h3>
                <p>${video.descricao}</p>
                <span class="check">✓ Assistido</span>
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