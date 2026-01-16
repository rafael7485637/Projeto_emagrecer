// Verificar se o usuário está logado
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/login';
}

// Carregar navbar
fetch("/components/navbar.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
    });

// Carregar categorias ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/videos/categorias', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar categorias');
        }

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
        alert('Erro ao carregar categorias');
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
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        // 👇 lê a resposta com segurança (mesmo se vier vazia)
        const text = await response.text();
        let data = null;

        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            // resposta não é JSON, ignora
        }

        console.log('Status:', response.status);
        console.log('Resposta:', data || text);

        // 👇 considera sucesso qualquer 2xx
        if (response.ok) {
            alert(data?.message || 'Vídeo cadastrado com sucesso!');
            setTimeout(() => {
                window.location.href = '/feed_videos.html';
            }, 500);
        } else {
            alert(data?.message || text || 'Erro ao cadastrar vídeo');
        }

    } catch (error) {
        console.error('Erro ao cadastrar vídeo:', error);
        alert('Erro ao cadastrar vídeo');
    }
});