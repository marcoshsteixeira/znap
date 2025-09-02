export class Pedidos {
  constructor(fastify) {
    this.fastify = fastify;
  }

  // Cria um pedido e seus itens
  create(data) {
    const { data_pedido, id_cliente, itens } = data;

    return new Promise((resolve, reject) => {
      // Cria o pedido
      this.fastify.mysql.query(
        "INSERT INTO pedidos (data, id_cliente) VALUES (?, ?)",
        [data_pedido, id_cliente],
        async (err, result) => {
          if (err) return reject(err);

          const id_pedido = result.insertId;

          try {
            // Cria os itens do pedido
            for (const item of itens) {
              const { id_produto, qtde, preco } = item;
              await new Promise((res, rej) => {
                this.fastify.mysql.query(
                  "INSERT INTO pedidos_itens (id_pedido, id_produto, qtde, preco) VALUES (?, ?, ?, ?)",
                  [id_pedido, id_produto, qtde, preco],
                  (e) => (e ? rej(e) : res())
                );
              });
            }

            resolve({ id_pedido, ...data });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  // Lê um pedido por ID ou todos os pedidos
  read(id = "") {
    return new Promise((resolve, reject) => {
      if (id) {
        this.fastify.mysql.query(
          "SELECT p.id_pedido, DATE_FORMAT(p.data, '%d/%m/%Y') AS data, c.nome AS cliente FROM pedidos p JOIN clientes c ON p.id_cliente = c.id_cliente WHERE p.id_pedido = ? ORDER BY p.id_pedido DESC",
          [id],
          (err, pedidoRows) => {
            if (err) return reject(err);

            this.fastify.mysql.query(
              "SELECT * FROM pedidos_itens WHERE id_pedido = ?",
              [id],
              (err2, itensRows) => {
                if (err2) return reject(err2);

                // Retorna o pedido com os itens
                resolve({ ...pedidoRows[0], itens: itensRows });
              }
            );
          }
        );
      } else {
        this.fastify.mysql.query("SELECT p.id_pedido, DATE_FORMAT(p.data, '%d/%m/%Y') AS data, c.nome AS cliente FROM pedidos p JOIN clientes c ON p.id_cliente = c.id_cliente", (err, pedidosRows) => {
          if (err) return reject(err);
          resolve(pedidosRows);
        });
      }
    });
  }

  // Deleta um pedido e seus itens
  delete(id) {
    return new Promise((resolve, reject) => {
      this.fastify.mysql.query(
        "DELETE FROM pedidos_itens WHERE id_pedido = ?",
        [id],
        (err) => {
          if (err) return reject(err);

          this.fastify.mysql.query(
            "DELETE FROM pedidos WHERE id_pedido = ?",
            [id],
            (err2) => {
              if (err2) return reject(err2);
              resolve({ success: true });
            }
          );
        }
      );
    });
  }
}
