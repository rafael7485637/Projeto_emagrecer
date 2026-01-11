const Util = require("./Util");
const pool = require("./conexaoBD"); // sua conexão já pronta

class AdministradorDAO {

async salvar(dados) {

  if (
    Util.isEmpty(dados.nome_adm) ||
    Util.isEmpty(dados.gmail_adm) ||
    Util.isEmpty(dados.senha_adm)
  ) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  if (!Util.validarEmail(dados.gmail_adm)) {
    throw new Error("E-mail inválido.");
  }


  const sql = `
    INSERT INTO administrador
    (nome_adm, gmail_adm, senha_adm)
    VALUES ($1,$2,$3)
    RETURNING idadministrador
  `;

  const { rows } = await pool.query(sql, [
    Util.sanitizarString(dados.nome_adm),
    Util.sanitizarString(dados.gmail_adm),
    dados.senha_adm
  ]);

  return rows[0];
}

// Função buscar administrador por email
async buscarPorEmail(gmail) {
  const sql = `
    SELECT idadministrador, gmail_adm, senha_adm
    FROM administrador
    WHERE gmail_adm = $1
  `;
  const { rows } = await pool.query(sql, [gmail]);
  return rows[0];
}

}




module.exports = AdministradorDAO;
