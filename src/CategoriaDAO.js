const pool = require("./ConexaoBD");

class CategoriaDAO {

  async listarCategorias() {
    const sql = `
      SELECT idcategoria, nome_categoria AS nome
      FROM categorias
      ORDER BY nome_categoria
    `;
    const { rows } = await pool.query(sql);
    return rows;
  }

}

module.exports = CategoriaDAO;
