import * as service from "../services/aboutService.js";
import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";
import { aboutUpload } from "../config/multer.config.js";
import fs from "fs";
import path from "path";

const endpoints = Router();
const auth = getAuthentication();

endpoints.get("/about", async (req, resp) => {
  const filter = req.query;
  let result = await service.getAbout(filter);
  resp.send(result);
});

endpoints.put(
  "/about/:id",
  auth,
  aboutUpload.single("image"),
  async (req, resp) => {
    try {
      const id = Number(req.params.id);
      const existing = await service.getAboutById(id);

      if (!existing) {
        resp.status(404).send({
          error: "About not found",
        });

        return;
      }

      if (req.file && existing.imageUrl) {
        const oldImagePath = path.resolve(existing.imageUrl.replace("/", ""));

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const about = {
        presentationText: req.body.presentationText,
        imageUrl: req.file
          ? `/uploads/about/${req.file.filename}`
          : existing.imageUrl,
      };

      const lines = await service.updateAbout(id, about);

      if (lines == 0) {
        resp.status(404).send({
          error: "About not found",
        });

        return;
      }

      resp.send({
        result: "Change saved successfully!",
      });
    } catch (err) {
      resp.status(400).send({
        error: err?.message || "Unexpected error",
      });
    }
  },
);

endpoints.delete("/about/:id", auth, async (req, resp) => {
  let id = Number(req.params.id);
  let lines = await service.deleteAbout(id);

  if (lines == 0) {
    resp.status(404).send({
      error: "About not found",
    });
  } else {
    resp.status(204).send();
  }
});

endpoints.get("/about/:id", auth, async (req, resp) => {
  let id = Number(req.params.id);
  let line = await service.getAboutById(id);

  if (!line) {
    resp.status(404).send({
      error: "About not found",
    });
  } else {
    resp.send(line);
  }
});

export default endpoints;
