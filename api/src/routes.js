import express from "express";
import contaController from "./controller/contaController.js";
import messageController from "./controller/messageController.js";

export default function addRoutes(api) {
  api.use(contaController);
  api.use(messageController);
}
