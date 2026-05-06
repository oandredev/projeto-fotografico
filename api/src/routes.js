import express from "express";
import contaController from "./controller/contaController.js";
import mensagemController from "./controller/mensagemController.js";

export default function adicionarRotas(api) {
  api.use(contaController);
  api.use(mensagemController);
}
