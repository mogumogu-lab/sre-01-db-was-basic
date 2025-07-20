import pg from 'pg';

/**
 * Items routes plugin for Fastify
 * @param {import('fastify').FastifyInstance} fastify
 * @param {*} opts
 */
export default async function expensiveRoutes(fastify, opts) {
    // Setup PostgreSQL connection pool (single pool, shared across requests)
    const pool = new pg.Pool({
        host: 'postgres-defense',
        port: 5432,
        user: 'user',
        password: 'password',
        database: 'postgres_defense',
    });

    fastify.post('/expensive/insert', async (req, reply) => {
        let values = [];
        for (let i = 0; i < 1000000; i++) {
            values.push(`('item_${i}')`);
        }
        const bulkInsert = `INSERT INTO items (name) VALUES ${values.join(',')}`;
        try {
            await pool.query(bulkInsert);
            return { ok: true, count: 1000000 };
        } catch (err) {
            req.log.error(err);
            return reply.code(500).send({ error: err.message });
        }
    });

    fastify.get('/expensive/select', async (req, reply) => {
        try {
            const res = await pool.query('SELECT * FROM items ORDER BY random() LIMIT 100000');
            return { count: res.rowCount };
        } catch (err) {
            req.log.error(err);
            return reply.code(500).send({ error: err.message });
        }
    });

    fastify.delete('/expensive/delete', async (req, reply) => {
        try {
            await pool.query('DELETE FROM items');
            return { ok: true };
        } catch (err) {
            req.log.error(err);
            return reply.code(500).send({ error: err.message });
        }
    });

    fastify.put('/expensive/stress/:id', async (req, reply) => {
    const id = Number(req.params.id);
    const { name } = req.body;
    try {
        // 동시에 여러 VU가 같은 row(id) 업데이트 → 락 경합 발생
        await pool.query(
            'UPDATE items SET name = $1 WHERE id = $2',
            [name, id]
        );
        return { ok: true };
    } catch (err) {
        req.log.error(err);
        return reply.code(500).send({ error: err.message });
    }
});
}
