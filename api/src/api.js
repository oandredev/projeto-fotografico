import "dotenv/config";
import express from "express";
import cors from "cors";
import adicionarRotas from "./routes.js";

const api = express();
api.use(express.json());
api.use(cors());

adicionarRotas(api);

const porta = process.env.PORTA;
api.listen(porta, () => {
  console.log("\n\x1b[34m● Servidor API\x1b[0m");
  console.log("\x1b[90m↳  Inicializando servidor...\x1b[0m");
  console.log(`\x1b[32m✔  API disponível na porta: ${porta}`);
});
