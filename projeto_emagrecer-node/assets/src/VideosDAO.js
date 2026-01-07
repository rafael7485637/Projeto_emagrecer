const Util = require("./Util");
const pool = require("./conexaoBD"); // sua conexão já pronta

class VideosDAO {

  //função salvar video
  async salvar(dados) {
    if (
      Util.isEmpty(dados.titulo) ||
      Util.isEmpty(dados.descricao) ||
      Util.isEmpty(dados.link)
    ) {
      throw new Error("Todos os campos são obrigatórios.");
    }

    if (!Util.validarURL(dados.link)) {
      throw new Error("Link inválido.");
    }

    const titulo = Util.sanitizarString(dados.titulo);
    const descricao = Util.sanitizarString(dados.descricao);
    const link = Util.sanitizarString(dados.link);
    const imagem = dados.imagem || null;
    const idcategoria = dados.idcategoria || null;

    const sql = `
      INSERT INTO video (titulo, descricao, link, imagem, idcategoria)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING idvideo
    `;

    const result = await pool.query(sql, [
      titulo,
      descricao,
      link,
      imagem,
      idcategoria
    ]);

    return result.rows[0]; // Retorna o vídeo inserido com idvideo
  }

 

  // função listar vídeos (com ou sem categoria)
async listarPorCategoria(idcategoria) {
  let sql = `
    SELECT 
      v.*, 
      c.nome_categoria AS categorias
    FROM video v
    LEFT JOIN categorias c ON c.idcategoria = v.idcategoria
  `;

  const params = [];

  // só aplica o filtro se tiver categoria válida
  if (idcategoria && idcategoria !== "") {
    sql += ` WHERE v.idcategoria = $1`;
    params.push(idcategoria);
  }

  sql += ` ORDER BY v.idvideo DESC`;

  const { rows } = await pool.query(sql, params);
  return rows;
}


  //função deletar video
  async deletar(idvideo) {
    const sql = `DELETE FROM video WHERE idvideo = $1`;
    const result = await pool.query(sql, [idvideo]);

    if (result.rowCount === 0) {
      throw new Error("Vídeo não encontrado.");
    }
  }

  //função atualizar imagem
  async atualizarImagem(idvideo, imagemPath) {
    const sql = `UPDATE video SET imagem = $1 WHERE idvideo = $2`;
    await pool.query(sql, [imagemPath, idvideo]);
  }

  //função buscar video por id
  async buscarPorId(idvideo) {
    const sql = `SELECT * FROM video WHERE idvideo = $1`;
    const { rows } = await pool.query(sql, [idvideo]);
    if (rows.length === 0) {
      throw new Error("Vídeo não encontrado");
    }
    return rows[0];
  }
}

module.exports = VideosDAO;
