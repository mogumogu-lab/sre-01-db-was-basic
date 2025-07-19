const WAS2_BASE_URL = 'http://was2:3000';

export default async function (fastify, opts) {
    async function proxyToWas2(req, reply, path, method = 'GET') {
        try {
            const url = `${WAS2_BASE_URL}${path}`;
            const headers = {};
            if (req.headers['authorization']) headers['authorization'] = req.headers['authorization'];
            if (req.body) headers['content-type'] = 'application/json';

            const fetchOptions = { method, headers };
            if (req.body) {
                fetchOptions.body = JSON.stringify(req.body);
            }
            const res = await fetch(url, fetchOptions);

            let data = null;
            try {
                data = await res.json();
            } catch (e) {
                data = null;
            }

            reply.code(res.status);
            return data;
        } catch (err) {
            req.log.error({ err }, 'Proxy to WAS2 failed');
            return reply.code(502).send({ error: 'Bad Gateway', detail: err.message });
        }
    }
    fastify.get('/items', (req, reply) => proxyToWas2(req, reply, '/items'));
    fastify.post('/items', (req, reply) => proxyToWas2(req, reply, '/items', 'POST'));
    fastify.get('/items/:id', (req, reply) => proxyToWas2(req, reply, `/items/${req.params.id}`));
    fastify.put('/items/:id', (req, reply) => proxyToWas2(req, reply, `/items/${req.params.id}`, 'PUT'));
    fastify.delete('/items/:id', (req, reply) => proxyToWas2(req, reply, `/items/${req.params.id}`, 'DELETE'));
}