// server.js
import Fastify from "fastify";
import FastifyMysql from "@fastify/mysql";
import cors from "@fastify/cors";
import { Product } from "./product.js";
import { Clientes } from "./cliente.js";
import { Pedidos } from "./pedidos.js";

const fastify = Fastify({ logger: true });

// Conexão MySQL
fastify.register(FastifyMysql, {
  connectionString: `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3306/${process.env.DB_NAME}`,
});

// CORS - deve estar registrado ANTES das rotas
fastify.register(cors, {
  origin: '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflight: true,
});

// Instanciando classes
const product = new Product(fastify);
const cliente = new Clientes(fastify);
const pedidos = new Pedidos(fastify);

// ==================== ROTAS PRODUTOS ====================
fastify.get("/produtos/:id?", async (request, reply) => {
  try {
    const id = request.params?.id;
    const result = await product.read(id);
    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
});

fastify.post("/produtos", async (request, reply) => {
  try {
    const result = await product.create(request.body);
    return reply.status(201).send(result);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
});

fastify.put("/produtos/:id", async (request, reply) => {
  try {
    const result = await product.update(request.params.id, request.body);
    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
});

fastify.delete("/produtos/:id", async (request, reply) => {
  try {
    await product.delete(request.params.id);
    return reply.status(204).send();
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
});

// ==================== ROTAS CLIENTES ====================
fastify.get("/clientes/:id?", async (request, reply) => {
  try {
    const id = request.params?.id;
    const result = await cliente.read(id);
    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
});

fastify.post("/clientes", async (request, reply) => {
  try {
    const result = await cliente.create(request.body);
    return reply.status(201).send(result);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
});

fastify.put("/clientes/:id", async (request, reply) => {
  try {
    const result = await cliente.update(request.params.id, request.body);
    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
});

fastify.delete("/clientes/:id", async (request, reply) => {
  try {
    await cliente.delete(request.params.id);
    return reply.status(204).send();
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
});

// ==================== ROTAS PEDIDOS ====================
fastify.get("/pedidos/:id?", async (request, reply) => {
  const id = request.params?.id;
  try {
    const result = await new Promise((resolve, reject) => {
      pedidos.read(id, (err, data) => (err ? reject(err) : resolve(data)));
    });
    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
});

fastify.post("/pedidos", async (request, reply) => {
  try {
    const result = await pedidos.create(request.body);
    return reply.status(201).send(result);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
});

fastify.put("/pedidos/:id", async (request, reply) => {
  try {
    const result = await pedidos.update(request.params.id, request.body);
    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
});

fastify.delete("/pedidos/:id", async (request, reply) => {
  try {
    await pedidos.delete(request.params.id);
    return reply.status(204).send();
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
});

// ==================== INICIA O SERVIDOR ====================
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em ${address}`);
});
