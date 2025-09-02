export class Clientes {
  constructor(fastify) {
    this.fastify = fastify;
  }

  create(data) {
    const { nome, email } = data;
    return new Promise((resolve, reject) => {
      this.fastify.mysql.query(
        "INSERT INTO clientes (nome, email) VALUES (?, ?)",
        [nome, email],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });
  }

  read(id) {
    return new Promise((resolve, reject) => {
      const sql = id 
        ? "SELECT * FROM clientes WHERE id_cliente = ?" 
        : "SELECT * FROM clientes";
      const params = id ? [id] : [];
      this.fastify.mysql.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
    });
  }

  update(id, data) {
    const { nome, email } = data;
    return new Promise((resolve, reject) => {
      this.fastify.mysql.query(
        "UPDATE clientes SET nome = ?, email = ? WHERE id_cliente = ?",
        [nome, email, id],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.fastify.mysql.query(
        "DELETE FROM clientes WHERE id_cliente = ?",
        [id],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });
  }
}
