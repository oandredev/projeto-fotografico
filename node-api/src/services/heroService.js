import * as repo from "../repository/heroRepository.js";
import { deleteFile } from "../utils/multerFunctions.js";

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

  for (const img of removedImages) {
    deleteFile(img);
  }

  const uploadedMap = {};
  for (const file of uploadedFiles) {
    uploadedMap[file.originalname] = `/uploads/hero/${file.filename}`;
  }

  let newImages;

  if (data.imageOrder?.length) {
    newImages = data.imageOrder
      .map((entry) => {
        if (entry.startsWith("/uploads/")) return entry;
        return uploadedMap[entry] ?? null;
      })
      .filter(Boolean);
  } else {
    newImages = [...existingImages, ...Object.values(uploadedMap)];
  }

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
