import express from "express";
import loginController from "./controller/loginController.js";

export default function adicionarRotas(api) {
  api.use(loginController);
}
