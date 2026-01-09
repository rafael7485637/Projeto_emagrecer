const Util = require("./Util");
const pool = require("./conexaoBD"); // sua conexão já pronta

class AdministradorDAO {

async salvar(dados) {

  if (
    Util.isEmpty(dados.nome) ||
    Util.isEmpty(dados.gmail) ||
    Util.isEmpty(dados.senha_adm)
  ) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  if (!Util.validarEmail(dados.gmail)) {
    throw new Error("E-mail inválido.");
  }


  const sql = `
    INSERT INTO usuario
    (nome, gmail, senha_adm)
    VALUES ($1,$2,$3)
    RETURNING idadministrador
  `;

  const { rows } = await pool.query(sql, [
    Util.sanitizarString(dados.nome),
    Util.sanitizarString(dados.gmail),
    dados.senha_adm
  ]);

  return rows[0];
}

}




module.exports = AdministradorDAO;
