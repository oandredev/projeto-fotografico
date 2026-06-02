import * as service from "../services/portfolioService.js";
import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";
import { portfolioUpload } from "../config/multer.config.js";
import multer from "multer";
import fs from "fs";

const endpoints = Router();
const auth = getAuthentication();

const PORTFOLIO_MAX_IMAGES = 20;

endpoints.get("/portfolio", async (req, resp) => {
  const result = await service.getPortfolios();
  resp.send(result);
});

endpoints.get("/portfolio/:id", async (req, resp) => {
  const result = await service.getPortfolioById(Number(req.params.id));

  if (!result) {
    return resp.status(404).send({
      error: "Portfolio not found",
    });
  }

  resp.send(result);
});

endpoints.put(
  "/portfolio/:id",
  auth,
  (req, resp, next) => {
    portfolioUpload.array("portfolio", PORTFOLIO_MAX_IMAGES)(
      req,
      resp,
      (err) => {
        if (err instanceof multer.MulterError) {
          return resp.status(400).send({
            error: err.message,
          });
        }

        if (err) {
          return resp.status(400).send({
            error: err.message,
          });
        }

        next();
      },
    );
  },
  async (req, resp) => {
    try {
      let existingImages = [];

      try {
        existingImages = JSON.parse(req.body.existingImages || "[]");
      } catch {
        existingImages = [];
      }

      const uploadedFiles = req.files || [];

      const result = await service.savePortfolio(
        {
          id: Number(req.params.id),
          category_id: Number(req.body.category_id),
          existingImages,
        },
        uploadedFiles,
        PORTFOLIO_MAX_IMAGES,
      );

      resp.send(result);
    } catch (err) {
      for (const file of req.files || []) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }

      resp.status(err.status ?? 500).send({
        error: err.message,
      });
    }
  },
);

export default endpoints;
