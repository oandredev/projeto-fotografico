import * as service from "../services/heroService.js";
import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";
import { heroUpload } from "../config/multer.config.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(__dirname, "../..");
const endpoints = Router();
const auth = getAuthentication();
const HERO_MAX_IMAGES = 16;

endpoints.get("/hero", async (req, resp) => {
  const result = await service.getHero(req.query);
  resp.send(result);
});

endpoints.get("/hero/:id", auth, async (req, resp) => {
  const id = Number(req.params.id);
  const hero = await service.getHeroById(id);

  if (!hero) {
    return resp.status(404).send({ error: "Hero not found" });
  }

  resp.send(hero);
});

endpoints.put(
  "/hero/:id",
  auth,
  (req, resp, next) => {
    heroUpload.array("images", HERO_MAX_IMAGES)(req, resp, (err) => {
      if (err instanceof multer.MulterError) {
        return resp
          .status(400)
          .send({ error: `Erro de upload: ${err.message}` });
      }
      if (err) {
        return resp.status(400).send({ error: err.message });
      }
      next();
    });
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
      const result = await service.saveHero(
        {
          slogan: req.body.slogan,
          existingImages,
        },
        uploadedFiles,
        HERO_MAX_IMAGES,
      );

      resp.send(result);
    } catch (err) {
      // Limpa arquivos enviados se o service rejeitar
      for (const file of req.files || []) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }

      resp
        .status(err.status ?? 400)
        .send({ error: err.message || "Unexpected error" });
    }
  },
);

export default endpoints;
