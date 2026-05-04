import express from "express";
import accountController from "./controller/accountController.js";

export default function adicionarRotas(api) {
  api.use(accountController);
}
