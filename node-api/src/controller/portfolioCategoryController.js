import * as service from "../services/portfolioCategoryService.js";
import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
const auth = getAuthentication();

endpoints.get("/portfolio-category", async (req, resp) => {
  try {
    const result = await service.getPortfolioCategories();
    resp.send(result);
  } catch (err) {
    resp
      .status(err.status ?? 500)
      .send({ error: err.message || "Unexpected error" });
  }
});

endpoints.get("/portfolio-category/:id", async (req, resp) => {
  try {
    const id = Number(req.params.id);
    const category = await service.getPortfolioCategoryById(id);

    if (!category) {
      return resp.status(404).send({ error: "Category not found" });
    }

    resp.send(category);
  } catch (err) {
    resp
      .status(err.status ?? 500)
      .send({ error: err.message || "Unexpected error" });
  }
});

endpoints.post("/portfolio-category", auth, async (req, resp) => {
  try {
    const result = await service.savePortfolioCategory(req.body);
    resp.status(201).send(result);
  } catch (err) {
    resp
      .status(err.status ?? 500)
      .send({ error: err.message || "Unexpected error" });
  }
});

endpoints.put("/portfolio-category/:id", auth, async (req, resp) => {
  try {
    const result = await service.savePortfolioCategory({
      ...req.body,
      id: Number(req.params.id),
    });

    resp.send(result);
  } catch (err) {
    resp
      .status(err.status ?? 500)
      .send({ error: err.message || "Unexpected error" });
  }
});

endpoints.delete("/portfolio-category/:id", auth, async (req, resp) => {
  try {
    const id = Number(req.params.id);
    const result = await service.deletePortfolioCategory(id);
    resp.send(result);
  } catch (err) {
    resp
      .status(err.status ?? 500)
      .send({ error: err.message || "Unexpected error" });
  }
});

export default endpoints;
