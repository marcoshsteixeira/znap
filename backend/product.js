export class Product {
  constructor(fastify) {
    this.fastify = fastify;
  }

  create(data) {
    const { nome, preco } = data;
    return new Promise((resolve, reject) => {
      this.fastify.mysql.query(
        "INSERT INTO produtos (nome, preco) VALUES (?, ?)",
        [nome, preco],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });
  }

  read(id) {
    return new Promise((resolve, reject) => {
      const sql = id 
        ? "SELECT * FROM produtos WHERE id_produto = ?" 
        : "SELECT * FROM produtos";
      const params = id ? [id] : [];
      this.fastify.mysql.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
    });
  }

  update(id, data) {
    const { nome, preco } = data;
    return new Promise((resolve, reject) => {
      this.fastify.mysql.query(
        "UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?",
        [nome, preco, id],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.fastify.mysql.query(
        "DELETE FROM produtos WHERE id_produto = ?",
        [id],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });
  }
}
