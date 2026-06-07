import * as repo from "../repository/portfolioRepository.js";
import fs from "fs";
import path from "path";

function parseImages(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export async function getPortfolios() {
  return repo.getPortfolios();
}

export async function getPortfolioById(id) {
  return repo.getPortfolioById(id);
}

export async function getPortfoliosByCategory(categoryId) {
  const all = await repo.getPortfoliosByCategory(categoryId);
  return all;
}

export async function savePortfolio(data, uploadedFiles, maxImages = 20) {
  const existing = data.id ? await repo.getPortfolioById(data.id) : null;

  const oldImages = existing?.image_urls ?? [];

  const uploadedImages = uploadedFiles.map(
    (f) => `/uploads/portfolio/${f.filename}`,
  );

  const finalImages = [...(data.existingImages ?? []), ...uploadedImages];

  if (finalImages.length > maxImages) {
    const err = new Error(`Max ${maxImages} images allowed`);
    err.status = 400;
    throw err;
  }

  const removed = oldImages.filter((img) => !finalImages.includes(img));

  const id = await repo.savePortfolio({
    id: data.id,
    category_id: data.category_id,
    image_urls: finalImages,
  });

  for (const img of removed) {
    const filePath = path.join(process.cwd(), img.replace(/^\//, ""));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  return { id, image_urls: finalImages };
}

export async function deletePortfolio(id) {
  const portfolio = await repo.getPortfolioById(id);

  if (!portfolio) {
    const err = new Error("Portfolio not found");
    err.status = 404;
    throw err;
  }

  for (const img of portfolio.image_urls ?? []) {
    const filePath = path.join(process.cwd(), img.replace(/^\//, ""));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await repo.deletePortfolio(id);

  return { result: "Portfolio deleted successfully!" };
}

export async function getStats() {
  const totals = await repo.getPortfolioStats();
  const categorias = await repo.getPortfolioCategoryStats();
  const visualizacoes = categorias.reduce(
    (acc, item) => acc + Number(item.views || 0),
    0,
  );

  return {
    categoriasAtivas: Number(totals.categoriasAtivas),
    fotosArmazenadas: Number(totals.fotosArmazenadas),
    visualizacoes,
    categorias,
  };
}
