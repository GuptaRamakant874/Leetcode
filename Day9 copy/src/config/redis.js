const {createClient} = require("redis");

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-16047.crce206.ap-south-1-1.ec2.cloud.redislabs.com'',
        port: 16047
    }
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err.message);
});


module.exports = redisClient;
