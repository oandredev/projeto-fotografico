import "dotenv/config";
import express from "express";
import cors from "cors";
import addRoutes from "./routes.js";
import { setupStatic } from "./config/static.config.js"; // Multer

const api = express();

api.use(express.json());
api.use(cors());

setupStatic(api); // Multer
addRoutes(api);

const port = process.env.PORT;

api.listen(port, () => {
  console.log("\n\x1b[34m● Server API\x1b[0m");
  console.log("\x1b[90m↳ Initializing server...\x1b[0m");
  console.log(`\x1b[32m✔ API available: ${port}`);
});
