import pg from 'pg';

/**
 * Items routes plugin for Fastify
 * @param {import('fastify').FastifyInstance} fastify
 * @param {*} opts
 */
export default async function itemsRoutes(fastify, opts) {
    // Setup PostgreSQL connection pool (single pool, shared across requests)
    const pool = new pg.Pool({
        host: 'postgres-defense',
        port: 5432,
        user: 'user',
        password: 'password',
        database: 'postgres_defense',
    });

    // Read all items
    fastify.get('/items', async (req, reply) => {
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
}
