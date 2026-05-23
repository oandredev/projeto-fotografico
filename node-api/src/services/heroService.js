import * as repo from "../repository/heroRepository.js";
import fs from "fs";
import path from "path";
import { PROJECT_ROOT } from "../controller/heroController.js";

export async function saveHero(data, uploadedFiles = [], maxImages = 16) {
  if (!data.slogan || data.slogan.trim() === "") {
    const err = new Error("Slogan is required");
    err.status = 400;
    throw err;
  }

  const existing = await repo.getHero({});

  const databaseImages = Array.isArray(existing?.imageUrls)
    ? existing.imageUrls
    : [];

  const existingImages = Array.isArray(data.existingImages)
    ? data.existingImages
    : [];

  const totalImages = existingImages.length + uploadedFiles.length;
  if (totalImages > maxImages) {
    const err = new Error(
      `Limite de ${maxImages} imagens excedido. Total enviado: ${totalImages}`,
    );
    err.status = 400;
    throw err;
  }

  const removedImages = databaseImages.filter(
    (img) => !existingImages.includes(img),
  );

  for (const imagePath of removedImages) {
    const relativePath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;
    const fullPath = path.resolve(PROJECT_ROOT, relativePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }

  const uploadedImages = uploadedFiles.map(
    (file) => `/uploads/hero/${file.filename}`,
  );

  const newImages = [...existingImages, ...uploadedImages];

  const id = await repo.saveHero({
    slogan: data.slogan.trim(),
    imageUrls: JSON.stringify(newImages),
  });

  if (!id) {
    const err = new Error("Erro ao salvar hero");
    err.status = 500;
    throw err;
  }

  return { result: "Change saved successfully!" };
}

export async function getHero(filter) {
  return await repo.getHero(filter);
}

export async function getHeroById(id) {
  if (!id || isNaN(id) || id <= 0) {
    const err = new Error("Invalid id");
    err.status = 400;
    throw err;
  }
  return await repo.getHeroById(id);
}
