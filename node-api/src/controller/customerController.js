import * as service from "../services/customerService.js";
import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
const auth = getAuthentication();

endpoints.get("/customer", auth, async (req, resp) => {
  const filter = req.query;

  let result = await service.getCustomers(filter);
  resp.send(result);
});

endpoints.get("/customer/stats", auth, async (req, resp) => {
  let result = await service.getCustomerStats();
  resp.send(result);
});

endpoints.post("/customer", auth, async (req, resp) => {
  let customer = req.body;

  try {
    let id = await service.addCustomer(customer);
    resp.status(201).send({
      id: id,
    });
  } catch (err) {
    resp.status(400).send({
      error: err.message,
    });
  }
});

endpoints.put("/customer/:id", auth, async (req, resp) => {
  let id = Number(req.params.id);
  let customer = req.body;

  let lines = await service.updateCustomer(id, customer);

  if (lines == 0) {
    resp.status(404).send({
      error: "Customer not found",
    });
  } else {
    resp.send({ result: "Change saved successfully!" });
  }
});

endpoints.delete("/customer/:id", auth, async (req, resp) => {
  let id = Number(req.params.id);

  let lines = await service.deleteCustomer(id);

  if (lines == 0) {
    resp.status(404).send({
      error: "Customer not found",
    });
  } else {
    resp.status(204).send();
  }
});

endpoints.get("/customer/:id", auth, async (req, resp) => {
  let id = Number(req.params.id);

  let line = await service.getCustomerById(id);

  if (!line) {
    resp.status(404).send({
      error: "Customer not found",
    });
  } else {
    resp.send(line);
  }
});

export default endpoints;
