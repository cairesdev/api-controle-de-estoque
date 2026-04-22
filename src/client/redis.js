const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 5) {
      console.error("❌ Redis: Máximo de tentativas atingido");
      return null;
    }
    return Math.min(times * 200, 2000);
  },
  lazyConnect: true,
});

redisClient.on("error", (err) => {
  console.error("❌ Erro Redis:", err.message);
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("✅ Redis conectado");
  } catch (error) {
    console.error("❌ Erro ao conectar Redis:", error);
    process.exit(1);
  }
}

async function disconnectRedis() {
  await redisClient.quit();
}

module.exports = { disconnectRedis, connectRedis, redisClient };
