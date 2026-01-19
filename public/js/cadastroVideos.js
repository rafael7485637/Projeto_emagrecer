
// Carregar navbar
fetch("/components/navbar_adm.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
    });

// Carregar categorias ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/videos/categorias', {
           credentials: "include"
        });

        if (response.status === 401 ) {
            window.location.href = '/index.html';
            return;
        }

        if (!response.ok) throw new Error('Erro ao buscar categorias');

        const categorias = await response.json();
        const select = document.getElementById('categoria');

        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.idcategoria;
            option.textContent = cat.nome;
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
});

// Cadastro de vídeo
document.getElementById('formCadastroVideo').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('titulo', document.getElementById('titulo').value);
    formData.append('descricao', document.getElementById('descricao').value);
    formData.append('link', document.getElementById('link').value);
    formData.append('idcategoria', document.getElementById('categoria').value);

    const imagem = document.getElementById('imagem').files[0];
    if (imagem) {
        formData.append('imagem', imagem);
    }

    try {
        const response = await fetch('/api/videos/cadastrar-video', {
            method: 'POST',
            credentials: "include",
            body: formData
        });

        // lê a resposta com segurança (mesmo se vier vazia)
        const text = await response.text();
        let data = null;

        try {
            data =  JSON.parse(text);;
        } catch (e) {
            // resposta não é JSON, ignora
        }

        // 👇 considera sucesso qualquer 2xx
        if (response.ok) {
            alert(data?.message || 'Vídeo cadastrado com sucesso!');
            setTimeout(() => {
                window.location.href = '/feed_videos.html';
            }, 500);
        } else {
            alert(data?.message || text || 'Erro ao cadastrar vídeo');
        }

        if (response.ok) {
            alert(data?.message || 'Vídeo cadastrado com sucesso!');
            window.location.href = '/feed_videos'; // Removido .html se o back cuida das rotas
        } else if (response.status === 401 || response.status === 403) {
            alert("Sessão expirada. Por favor, faça login novamente.");
            window.location.href = "/login";
        } else {
            alert(data?.message || text || 'Erro ao cadastrar vídeo');
        }

    } catch (error) {
        console.error('Erro ao cadastrar vídeo:', error);
        alert('Erro de conexão com o servidor.');
    }
});