const Util = require("./Util");
const pool = require("./conexaoBD"); // sua conexão já pronta

class CadastroDAO {

async salvar(dados) {

  if (
    Util.isEmpty(dados.nome) ||
    Util.isEmpty(dados.gmail) ||
    Util.isEmpty(dados.data_nascimento) ||
    Util.isEmpty(dados.peso) ||
    Util.isEmpty(dados.altura) ||
    Util.isEmpty(dados.telefone) ||
    Util.isEmpty(dados.senha_usuario)
  ) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  if (!Util.validarEmail(dados.gmail)) {
    throw new Error("E-mail inválido.");
  }


  const sql = `
    INSERT INTO usuario
    (nome, gmail, data_nascimento, peso, altura, telefone, foto, status, senha_usuario)
    VALUES ($1,$2,$3,$4,$5,$6,$7,'Pago', $8)
    RETURNING idusuario
  `;

  const { rows } = await pool.query(sql, [
    Util.sanitizarString(dados.nome),
    Util.sanitizarString(dados.gmail),
    dados.data_nascimento,
    parseFloat(dados.peso),
    parseFloat(dados.altura),
    Util.sanitizarString(dados.telefone),
    dados.foto, // null inicialmente
    dados.senha_usuario
  ]);

  return rows[0];
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

  // Buscar usuário por email
  async buscarPorEmail(gmail) {
  const sql = `
    SELECT idusuario, gmail, senha_usuario, status
    FROM usuario
    WHERE gmail = $1
  `;
  const { rows } = await pool.query(sql, [gmail]);
  return rows[0];
}


  // Atualizar foto do usuário
async atualizarFoto(idusuario, fotoPath) {
  const sql = `
    UPDATE usuario
    SET foto = $1
    WHERE idusuario = $2
  `;
  await pool.query(sql, [fotoPath, idusuario]);
}

//buscar usuario por gmail
async buscarPorEmail(gmail) {
  const sql = `
    SELECT * FROM usuario
    WHERE gmail = $1
  `;
  const { rows } = await pool.query(sql, [gmail]);
  return rows[0];
}



// analizar se o gmail ja existe como adm
async emailExisteComoAdm(gmail) {
  const sql = "SELECT 1 FROM administrador WHERE gmail_adm = $1";
  const { rowCount } = await pool.query(sql, [gmail]);
  return rowCount > 0;
}
}

module.exports = CadastroDAO;
