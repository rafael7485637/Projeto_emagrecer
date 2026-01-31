const Util = require("./Util");
const pool = require("./ConexaoBD"); // sua conexão já pronta

class VisualizacaoDAO {

   async registrar(idusuario, idvideo) {
    const sql = `
      INSERT INTO visualizacao (idusuario, idvideo)
      VALUES ($1, $2)
    `;
    await pool.query(sql, [idusuario, idvideo]);
  }

  async contarPorVideo(idvideo) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM visualizacao
      WHERE idvideo = $1
    `;
    const { rows } = await pool.query(sql, [idvideo]);
    return rows[0].total;
  }
}


module.exports = VisualizacaoDAO;
