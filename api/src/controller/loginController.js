import { generateToken } from "../utils/jwt.js";
import * as service from "../services/loginService.js";
import { Router } from "express";

const endpoints = Router();

endpoints.post("/login", async (req, resp) => {
  try {
    let login = req.body;

    let id = await service.criarConta(login);
    resp.status(204).send();
  } catch (err) {
    resp.status(400).send({ erro: err.message });
  }
});

endpoints.post("/login/entrar", async (req, resp) => {
  try {
    let login = req.body;

    let usu = await service.login(login.email, login.senha);
    let token = generateToken(usu);

    resp.send({ token });
  } catch (err) {
    resp.status(401).send({ erro: err.message });
  }
});

export default endpoints;
