const {createClient} = require("redis");

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19368.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 19368
    }
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err.message);
});


module.exports = redisClient;
