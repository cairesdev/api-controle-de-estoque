"use strict";

require("dotenv").config();
const debug = require("debug")("nodestr:server");
const http = require("http");
const app = require("../app");

const DEFAULT_PORT = 8004;
const PORT = normalizePort(process.env.API_PORT || DEFAULT_PORT);

app.set("port", PORT);
app.disable("x-powered-by");
app.disable("etag");

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
});

server.on("error", onError);
server.on("listening", onListening);

// Funções utilitárias
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== "listen") throw error;

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
  switch (error.code) {
    case "EACCES":
      console.error(`❌ ${bind} requer privilégios elevados.`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`❌ ${bind} já está em uso!`);
      process.exit(1);
      break;
    default:
      console.error(`❌ Erro no servidor:`, error);
      process.exit(1);
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

// Tratamento global de erros não previstos
process.on("uncaughtException", (err) => {
  console.error("💥 Erro não tratado:", err);
  shutdownGracefully();
});

process.on("unhandledRejection", (reason) => {
  console.error("⚠️  Rejeição de promessa não tratada:", reason);
  shutdownGracefully();
});

// Encerramento gracioso
process.on("SIGTERM", shutdownGracefully);
process.on("SIGINT", shutdownGracefully);

function shutdownGracefully() {
  console.log("🛑 Encerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor encerrado com sucesso.");
    process.exit(0);
  });

  // Caso não consiga fechar em X segundos
  setTimeout(() => {
    console.error("⏳ Encerramento forçado.");
    process.exit(1);
  }, 5000).unref();
}
