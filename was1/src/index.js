import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/', async (request, reply) => {
    return { hello: 'from was1' };
});

fastify.listen({ port: 3000, host: '0.0.0.0' })
    .then(address => {
        fastify.log.info(`Server listening at ${address}`);
    })
    .catch(err => {
        fastify.log.error(err);
        process.exit(1);
    });
