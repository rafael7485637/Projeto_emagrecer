const Util = require("./Util");
const pool = require("./conexaoBD"); // sua conexão já pronta

class CadastroDAO {

  // Função salvar usuário
  async salvar(dados) {
    if (
      Util.isEmpty(dados.nome) ||
      Util.isEmpty(dados.gmail) ||
      Util.isEmpty(dados.nascimento) ||
      Util.isEmpty(dados.cpf) ||
      Util.isEmpty(dados.peso) ||
      Util.isEmpty(dados.altura) ||
      Util.isEmpty(dados.telefone) ||
      Util.isEmpty(dados.endereco)
    ) {
      throw new Error("Todos os campos são obrigatórios.");
    }

    // Validações adicionais
    if (!Util.validarEmail(dados.gmail)) {
      throw new Error("E-mail inválido.");
    }

    if (!Util.validarCPF(dados.cpf)) {
      throw new Error("CPF inválido.");
    }

    const nome = Util.sanitizarString(dados.nome);
    const gmail = Util.sanitizarString(dados.gmail);
    const nascimento = dados.nascimento; // Assumindo formato YYYY-MM-DD
    const cpf = Util.sanitizarString(dados.cpf);
    const peso = parseFloat(dados.peso);
    const altura = parseFloat(dados.altura);
    const telefone = Util.sanitizarString(dados.telefone);
    const endereco = Util.sanitizarString(dados.endereco);
    const status = 'ativo'; // Status padrão

    const sql = `
      INSERT INTO usuario (nome_completo, data_nascimento, cpf, peso, altura, telefone, endereco, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING idusuario
    `;

    const result = await pool.query(sql, [
      nome,
      nascimento,
      cpf,
      peso,
      altura,
      telefone,
      endereco,
      status
    ]);

    return result.rows[0]; // Retorna o usuário inserido com idusuario
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

  // Função buscar usuário por ID
  async buscarPorId(idusuario) {
    const sql = `SELECT * FROM usuario WHERE idusuario = $1`;
    const result = await pool.query(sql, [idusuario]);

    if (result.rows.length === 0) {
      throw new Error("Usuário não encontrado.");
    }

    return result.rows[0];
  }

  // Função deletar usuário
  async deletar(idusuario) {
    const sql = `DELETE FROM usuario WHERE idusuario = $1`;
    const result = await pool.query(sql, [idusuario]);

    if (result.rowCount === 0) {
      throw new Error("Usuário não encontrado.");
    }
  }

  // Função atualizar status do usuário (ex.: bloquear/desbloquear)
  async atualizarStatus(idusuario, status) {
    const sql = `UPDATE usuario SET status = $1 WHERE idusuario = $2`;
    const result = await pool.query(sql, [status, idusuario]);

    if (result.rowCount === 0) {
      throw new Error("Usuário não encontrado.");
    }
  }

}

module.exports = CadastroDAO;
