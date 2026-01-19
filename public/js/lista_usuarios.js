// Carregar navbar
fetch("/components/navbar_adm.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
    });

// Função auxiliar para lidar com respostas do servidor
async function handleResponse(response) {
    if (response.status === 401 || response.status === 403) {
        window.location.href = "/login";
        return null;
    }
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro na requisição");
    }
    return response.json();
}

async function carregarUsuarios() {
    try {
        const response = await fetch("/api/users/usuarios", {
            method: "GET",
            credentials: "include" // Essencial para cookies de sessão
        });

        const usuarios = await handleResponse(response);
        if (!usuarios) return;

        const feed = document.getElementById("userFeed");
        feed.innerHTML = "";

        usuarios.forEach(user => {
            const card = document.createElement("div");
            card.className = "user-card";

            // Criar imagem
            const img = document.createElement("img");
            img.src = user.foto ? user.foto : "/foto/default.png";
            img.alt = "Foto do usuário";
            img.onerror = () => { img.src = "/foto/default.png"; };

            const fotoDiv = document.createElement("div");
            fotoDiv.className = "user-foto";
            fotoDiv.appendChild(img);

            // Header
            const header = document.createElement("div");
            header.className = "card-header";
            header.innerHTML = `
                <div class="user-name">${user.nome}</div>
                <span class="status-badge ${user.status === 'Pago' ? 'pago' : 'pendente'}">${user.status || "Inativo"}</span>
            `;
            header.prepend(fotoDiv);

            // Corpo
            const info = document.createElement("div");
            info.className = "user-info-grid";
            info.innerHTML = `
                <div class="info-item"><strong>Email</strong> ${user.gmail}</div>
                <div class="info-item"><strong>Nascimento</strong> ${formatarData(user.data_nascimento)}</div>
                <div class="info-item"><strong>Telefone</strong> ${user.telefone}</div>
                <div class="info-item"><strong>Peso</strong> ${user.peso} kg</div>
                <div class="info-item"><strong>Altura</strong> ${user.altura} m</div>
            `;

            // Ações
            const actions = document.createElement("div");
            actions.className = "card-actions";

            const btnPago = criarBotao("btn btn-ativar", "Pago", () => alterarStatus(user.idusuario, "Pago"));
            const btnNaoPago = criarBotao("btn btn-desativar", "Não Pago", () => alterarStatus(user.idusuario, "Não Pago"));
            const btnEx = criarBotao("btn btn-excluir", "Excluir", () => excluirUsuario(user.idusuario, user.nome));

            actions.append(btnPago, btnNaoPago, btnEx);

            card.append(header, info, actions);
            feed.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar usuários");
    }
}

// Funções auxiliares de UI
function criarBotao(classe, texto, onClick) {
    const btn = document.createElement("button");
    btn.className = classe;
    btn.textContent = texto;
    btn.onclick = onClick;
    return btn;
}

function formatarData(dataStr) {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR");
}

async function alterarStatus(idusuario, status) {
    try {
        const response = await fetch(`/api/users/usuarios/${idusuario}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ status })
        });

        if (await handleResponse(response)) {
            carregarUsuarios();
        }
    } catch (error) {
        alert("Erro ao alterar status");
    }
}

async function excluirUsuario(idusuario, nome) {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${nome}?`)) return;

    try {
        const response = await fetch(`/api/users/usuarios/${idusuario}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (await handleResponse(response)) {
            carregarUsuarios();
        }
    } catch (error) {
        alert("Erro ao excluir usuário");
    }
}

carregarUsuarios();