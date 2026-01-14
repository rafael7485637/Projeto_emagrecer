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
                const response = await fetch('/categorias', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
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
                const response = await fetch('/cadastrar-video', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });

                if (response.ok) {
                    alert('Vídeo cadastrado com sucesso!');
                    window.location.href = '/';
                } else {
                    const error = await response.text();
                    alert('Erro: ' + error);
                }
            } catch (error) {
                console.error('Erro ao cadastrar vídeo:', error);
                alert('Erro ao cadastrar vídeo');
            }
        });