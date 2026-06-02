import express from "express";
import contaController from "./controller/contaController.js";
import messageController from "./controller/messageController.js";
import customerController from "./controller/customerController.js";
import aboutController from "./controller/aboutController.js";
import heroController from "./controller/heroController.js";
import portfolioCategoryController from "./controller/portfolioCategoryController.js";

export default function addRoutes(api) {
  api.use(contaController);

  api.use(messageController);
  api.use(customerController);

  api.use(aboutController);
  api.use(heroController);
  api.use(portfolioCategoryController);
}
