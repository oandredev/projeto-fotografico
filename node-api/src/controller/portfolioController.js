import * as service from "../services/portfolioService.js";
import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";
import { portfolioUpload } from "../config/multer.config.js";
import multer from "multer";
import fs from "fs";

const endpoints = Router();
const auth = getAuthentication();

const MAX_IMAGES = 20;

function uploadMiddleware(req, resp, next) {
  portfolioUpload.array("images", MAX_IMAGES)(req, resp, (err) => {
    if (err instanceof multer.MulterError || err) {
      return resp.status(400).send({ error: err.message });
    }
    next();
  });
}

endpoints.get("/portfolio", async (req, resp) => {
  try {
    resp.send(await service.getPortfolios());
  } catch (err) {
    resp.status(err.status ?? 500).send({ error: err.message });
  }
});

endpoints.get("/portfolio/:id", async (req, resp) => {
  try {
    const data = await service.getPortfolioById(Number(req.params.id));

    if (!data) {
      return resp.status(404).send({ error: "Portfolio not found" });
    }

    resp.send(data);
  } catch (err) {
    resp.status(err.status ?? 500).send({ error: err.message });
  }
});

endpoints.post("/portfolio", auth, uploadMiddleware, async (req, resp) => {
  try {
    const existingImages = JSON.parse(req.body.existingImages || "[]");

    const result = await service.savePortfolio(
      {
        category_id: Number(req.body.category_id),
        existingImages,
      },
      req.files || [],
      MAX_IMAGES,
    );

    resp.status(201).send(result);
  } catch (err) {
    for (const file of req.files || []) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }

    resp.status(err.status ?? 500).send({ error: err.message });
  }
});

endpoints.put("/portfolio/:id", auth, uploadMiddleware, async (req, resp) => {
  try {
    const existingImages = JSON.parse(req.body.existingImages || "[]");

    const result = await service.savePortfolio(
      {
        id: Number(req.params.id),
        category_id: Number(req.body.category_id),
        existingImages,
      },
      req.files || [],
      MAX_IMAGES,
    );

    resp.send(result);
  } catch (err) {
    for (const file of req.files || []) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }

    resp.status(err.status ?? 500).send({ error: err.message });
  }
});

endpoints.delete("/portfolio/:id", auth, async (req, resp) => {
  try {
    resp.send(await service.deletePortfolio(Number(req.params.id)));
  } catch (err) {
    resp.status(err.status ?? 500).send({ error: err.message });
  }
});

export default endpoints;
