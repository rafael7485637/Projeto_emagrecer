const pool = require("/ConexaoBD");
const bcrypt = require("bcrypt");

class LoginDAO {

  async buscarAdminPorEmail(gmail) {
    const sql = "SELECT * FROM administrador WHERE gmail_adm = $1";
    const { rows } = await pool.query(sql, [gmail]);
    return rows[0];
  }

  async buscarUsuarioPorEmail(gmail) {
    const sql = `
      SELECT * FROM usuario
      WHERE gmail = $1 AND status = 'Pago'
    `;
    const { rows } = await pool.query(sql, [gmail]);
    return rows[0];
  }

  async validarSenha(senha, hash) {
    return bcrypt.compare(senha, hash);
  }
}

module.exports = LoginDAO;
