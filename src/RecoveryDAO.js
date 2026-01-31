// src/RecoveryDAO.js
const pool = require("./ConexaoBD"); // Certifique-se de que este é seu arquivo de conexão

class RecoveryDAO {
  // Salva o token hasheado e a validade
  async salvarToken(idUsuario, tokenHash, validade) {
    const sql = `
      UPDATE usuario 
      SET "passwordResetToken" = $1, "passwordResetExpires" = $2 
      WHERE idusuario = $3
    `;
    // Se mudou para TIMESTAMP, use: new Date(validade)
    return await pool.query(sql, [tokenHash, new Date(validade), idUsuario]);
  }

  // Busca usuário pelo token e verifica se não expirou
  async buscarUsuarioPorToken(tokenHash) {
  const sql = `
    SELECT idusuario, gmail, senha_usuario
    FROM usuario
    WHERE "passwordResetToken" = $1
    AND "passwordResetExpires" > NOW()
  `;
  const result = await pool.query(sql, [tokenHash]);
  return result.rows[0];
}

  // Atualiza a senha e limpa o token
  async atualizarSenha(idUsuario, novaSenhaHash) {
    const sql = `
      UPDATE usuario 
      SET senha_usuario = $1, "passwordResetToken" = NULL, "passwordResetExpires" = NULL 
      WHERE idusuario = $2
    `;
    return await pool.query(sql, [novaSenhaHash, idUsuario]);
  }
}

module.exports = RecoveryDAO;