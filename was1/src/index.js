import fastifyWebsocket from '@fastify/websocket';
import Fastify from 'fastify';
import itemsRoutes from './routes/items.js';


const fastify = Fastify({ logger: true });

fastify.register(itemsRoutes);
fastify.register(fastifyWebsocket);

fastify.get('/', async () => ({ hello: 'from API Gateway' }));

fastify.listen({ port: 53000, host: '0.0.0.0', backlog: 2048 })
    .then(address => fastify.log.info(`Server listening at ${address}`))
    .catch(err => {
        fastify.log.error(err);
        process.exit(1);
    });

fastify.get('/ws', { websocket: true }, (conn, req) => {
    conn.socket.on('message', message => {
        conn.socket.send(`Echo: ${message}`);
    });
});