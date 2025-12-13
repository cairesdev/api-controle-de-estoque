"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./src/routes");

const app = express();

app.use((req, res, next) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(compression());

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: process.env.NEXT_FRONTEND_DNS,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "1d",
    etag: false,
  })
);

app.get("/", (req, res) => res.status(200).send("1.0"));

app.use(routes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.use((err, req, res, next) => {
  console.error("Erro no servidor: ", err);
  res.status(500).json({ error: "Erro interno no servidor" });
});

module.exports = app;
