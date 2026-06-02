import * as repo from "../repository/portfolioCategoryRepository.js";

function createError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function savePortfolioCategory(data) {
  if (!data.name || data.name.trim() === "") {
    throw createError("Category name is required", 400);
  }

  if (
    data.order_index === undefined ||
    data.order_index === null ||
    isNaN(data.order_index)
  ) {
    throw createError("Order index is required", 400);
  }

  if (data.id) {
    const existing = await repo.getPortfolioCategoryById(data.id);
    if (!existing) {
      throw createError("Category not found", 404);
    }
  }

  const id = await repo.savePortfolioCategory({
    id: data.id,
    name: data.name.trim(),
    order_index: Number(data.order_index),
  });

  if (!id) {
    throw createError("Error saving category", 500);
  }

  return { result: "Change saved successfully!" };
}

export async function getPortfolioCategories() {
  return await repo.getPortfolioCategories();
}

export async function getPortfolioCategory(filter) {
  return await repo.getPortfolioCategory(filter);
}

export async function getPortfolioCategoryById(id) {
  if (!id || isNaN(id) || id <= 0) {
    throw createError("Invalid id", 400);
  }

  return await repo.getPortfolioCategoryById(id);
}

export async function deletePortfolioCategory(id) {
  if (!id || isNaN(id) || id <= 0) {
    throw createError("Invalid id", 400);
  }

  const affectedRows = await repo.deletePortfolioCategory(id);

  if (!affectedRows) {
    throw createError("Category not found", 404);
  }

  return { result: "Category deleted successfully!" };
}
