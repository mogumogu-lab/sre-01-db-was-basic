import Fastify from 'fastify';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
});

const fastify = Fastify({ logger: true });

fastify.get('/', async (request, reply) => {
    return { hello: 'from was2' };
});

fastify.get('/db', async (request, reply) => {
    const res = await pool.query('SELECT NOW() as now');
    return res.rows[0];
});

fastify.listen({ port: 3000, host: '0.0.0.0' })
    .then(address => {
        fastify.log.info(`Server listening at ${address}`);
    })
    .catch(err => {
        fastify.log.error(err);
        process.exit(1);
    });
