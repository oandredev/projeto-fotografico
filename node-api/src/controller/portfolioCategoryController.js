import * as service from "../services/portfolioCategoryService.js";
import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
const auth = getAuthentication();

endpoints.get("/portfolio-category", async (req, resp) => {
  resp.send(await service.getPortfolioCategories());
});

endpoints.get("/portfolio-category/:id", async (req, resp) => {
  const result = await service.getPortfolioCategoryById(Number(req.params.id));

  if (!result) {
    return resp.status(404).send({
      error: "Category not found",
    });
  }

  resp.send(result);
});

endpoints.post("/portfolio-category", auth, async (req, resp) => {
  resp.status(201).send(await service.savePortfolioCategory(req.body));
});

endpoints.put("/portfolio-category/:id", auth, async (req, resp) => {
  resp.send(
    await service.savePortfolioCategory({
      ...req.body,
      id: Number(req.params.id),
    }),
  );
});

endpoints.delete("/portfolio-category/:id", auth, async (req, resp) => {
  try {
    const id = Number(req.params.id);
    const result = await service.deletePortfolioCategory(id);
    resp.send(result);
  } catch (err) {
    return resp.status(err.status ?? 500).send({
      error: err.message,
    });
  }
});

export default endpoints;
