import Fastify from 'fastify';
import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;

// 환경변수 기반 DB 연결
const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
});

const fastify = Fastify({ logger: true });

// Read all items
fastify.get('/items', async () => {
    const res = await pool.query('SELECT * FROM items ORDER BY id');
    return res.rows;
});

// Read one item by id
fastify.get('/items/:id', async (req, reply) => {
    const id = Number(req.params.id);
    const res = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (res.rows.length === 0) {
        return reply.code(404).send({ error: 'Not found' });
    }
    return res.rows[0];
});

// Create
fastify.post('/items', async (req, reply) => {
    const { name } = req.body;
    const res = await pool.query(
        'INSERT INTO items (name) VALUES ($1) RETURNING *',
        [name]
    );
    return res.rows[0];
});

// Update
fastify.put('/items/:id', async (req, reply) => {
    const id = Number(req.params.id);
    const { name } = req.body;
    const res = await pool.query(
        'UPDATE items SET name = $1 WHERE id = $2 RETURNING *',
        [name, id]
    );
    if (res.rows.length === 0) {
        return reply.code(404).send({ error: 'Not found' });
    }
    return res.rows[0];
});

// Delete
fastify.delete('/items/:id', async (req, reply) => {
    const id = Number(req.params.id);
    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    return { ok: true };
});

fastify.get('/', async () => ({ hello: 'from was2' }));

fastify.listen({ port: 53001, host: '0.0.0.0' })
    .then(address => fastify.log.info(`Server listening at ${address}`))
    .catch(err => {
        fastify.log.error(err);
        process.exit(1);
    });
