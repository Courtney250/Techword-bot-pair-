const inMemory = {};

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisCmd(...args) {
    const res = await fetch(`${REDIS_URL}/pipeline`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${REDIS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([args])
    });
    const data = await res.json();
    return data[0]?.result;
}

async function setSession(id, data, ttl = 300) {
    if (REDIS_URL && REDIS_TOKEN) {
        const value = Buffer.from(JSON.stringify(data)).toString('base64');
        await redisCmd('SET', `sess:${id}`, value, 'EX', ttl);
    } else {
        inMemory[id] = data;
        setTimeout(() => delete inMemory[id], ttl * 1000);
    }
}

async function getSession(id) {
    if (REDIS_URL && REDIS_TOKEN) {
        const value = await redisCmd('GET', `sess:${id}`);
        if (!value) return null;
        return JSON.parse(Buffer.from(value, 'base64').toString('utf8'));
    }
    return inMemory[id] ?? null;
}

async function deleteSession(id) {
    if (REDIS_URL && REDIS_TOKEN) {
        await redisCmd('DEL', `sess:${id}`);
    } else {
        delete inMemory[id];
    }
}

module.exports = { setSession, getSession, deleteSession };
