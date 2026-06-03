import * as repo from "../repository/portfolioCategoryRepository.js";
import * as portfolioService from "./portfolioService.js";
import fs from "fs/promises";
import path from "path";

function createError(msg, status) {
  const err = new Error(msg);
  err.status = status;
  return err;
}

export async function getPortfolioCategories() {
  return repo.getPortfolioCategories();
}

export async function getPortfolioCategoryById(id) {
  return repo.getPortfolioCategoryById(id);
}

export async function savePortfolioCategory(data) {
  if (!data.name?.trim()) {
    throw createError("Category name is required", 400);
  }

  if (data.order_index == null) {
    throw createError("Order index is required", 400);
  }

  if (data.id) {
    const exists = await repo.getPortfolioCategoryById(data.id);
    if (!exists) throw createError("Category not found", 404);
  }

  await repo.savePortfolioCategory({
    id: data.id,
    name: data.name.trim(),
    order_index: Number(data.order_index),
  });

  return { result: "Saved" };
}

export async function deletePortfolioCategory(id) {
  const portfolios = await portfolioService.getPortfoliosByCategory(id);

  for (const p of portfolios) {
    for (const img of p.image_urls ?? []) {
      const filePath = path.join(process.cwd(), img.replace(/^\//, ""));
      try {
        await fs.unlink(filePath);
      } catch {}
    }

    await portfolioService.deletePortfolio(p.id);
  }

  const deleted = await repo.deletePortfolioCategory(id);

  if (!deleted) {
    throw createError("Category not found", 404);
  }

  return { success: true };
}
