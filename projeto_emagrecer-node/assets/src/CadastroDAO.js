const Util = require("./Util");
const pool = require("./conexaoBD"); // sua conexão já pronta

class CadastroDAO {

async salvar(dados) {
  if (
    Util.isEmpty(dados.nome) ||
    Util.isEmpty(dados.gmail) ||
    Util.isEmpty(dados.data_nascimento) ||
    Util.isEmpty(dados.cpf) ||
    Util.isEmpty(dados.peso) ||
    Util.isEmpty(dados.altura) ||
    Util.isEmpty(dados.telefone) ||
    Util.isEmpty(dados.endereco)
  ) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  if (!Util.validarEmail(dados.gmail)) {
    throw new Error("E-mail inválido.");
  }

  if (!Util.validarCPF(dados.cpf)) {
    throw new Error("CPF inválido.");
  }

  const sql = `
    INSERT INTO usuario 
    (nome, gmail, data_nascimento, cpf, peso, altura, telefone, endereco, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pendente')
  `;

  await pool.query(sql, [
    Util.sanitizarString(dados.nome),
    Util.sanitizarString(dados.gmail),
    dados.data_nascimento,
    Util.sanitizarString(dados.cpf),
    parseFloat(dados.peso),
    parseFloat(dados.altura),
    Util.sanitizarString(dados.telefone),
    Util.sanitizarString(dados.endereco)
  ]);
}

  // Função listar usuários
  async listarUsuarios() {
    const sql = `
      SELECT * FROM usuario
      ORDER BY idusuario DESC
    `;
    const { rows } = await pool.query(sql);
    return rows;
  }

  // Função atualizar status do usuário (ex.: bloquear/desbloquear)
  async atualizarStatus(id, status) {
  const sql = `
    UPDATE usuario
    SET status = $1
    WHERE idusuario = $2
  `;
  await pool.query(sql, [status, id]);
  }
}

module.exports = CadastroDAO;
