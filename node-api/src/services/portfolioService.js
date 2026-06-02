import * as repository from "../repository/portfolioRepository.js";
import fs from "fs";
import path from "path";

export async function savePortfolio(data, uploadedFiles, maxImages = 20) {
  const existingPortfolio = data.id
    ? await repository.getPortfolioById(data.id)
    : null;

  const oldImages = existingPortfolio?.image_urls ?? [];

  const uploadedImages = uploadedFiles.map(
    (file) => `/uploads/portfolio/${file.filename}`,
  );

  const finalImages = [...data.existingImages, ...uploadedImages];

  if (finalImages.length > maxImages) {
    const error = new Error(`Maximum ${maxImages} images allowed`);
    error.status = 400;
    throw error;
  }

  const removedImages = oldImages.filter((img) => !finalImages.includes(img));

  const id = await repository.savePortfolio({
    id: data.id,
    category_id: data.category_id,
    image_urls: finalImages,
  });

  for (const image of removedImages) {
    const filePath = path.join(process.cwd(), image.replace(/^\//, ""));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return {
    id,
    image_urls: finalImages,
  };
}

export async function getPortfolios() {
  return repository.getPortfolios();
}

export async function getPortfolio(filter) {
  return repository.getPortfolio(filter);
}

export async function getPortfolioById(id) {
  return repository.getPortfolioById(id);
}

export async function getPortfolioByCategory(categoryId) {
  return repository.getPortfolioByCategory(categoryId);
}

export async function deletePortfolio(id) {
  const portfolio = await repository.getPortfolioById(id);

  if (!portfolio) {
    const error = new Error("Portfolio not found");
    error.status = 404;
    throw error;
  }

  for (const image of portfolio.image_urls) {
    const filePath = path.join(process.cwd(), image.replace(/^\//, ""));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return repository.deletePortfolio(id);
}
