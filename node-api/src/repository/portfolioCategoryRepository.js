import connection from "./connection.js";

function handleDbError(err) {
  if (err.code === "ER_DUP_ENTRY") {
    if (err.message.includes("name")) {
      const error = new Error("Category name already exists");
      error.status = 409;
      throw error;
    }
    if (err.message.includes("order_index")) {
      const error = new Error("Order index already in use");
      error.status = 409;
      throw error;
    }
    const error = new Error("Duplicate entry");
    error.status = 409;
    throw error;
  }

  const error = new Error("Database error");
  error.status = 500;
  throw error;
}

export async function savePortfolioCategory(data) {
  try {
    if (data.id) {
      await connection.query(
        `
        UPDATE portfolio_category
        SET name = ?, order_index = ?
        WHERE id = ?
        `,
        [data.name, data.order_index, data.id],
      );

      return data.id;
    }

    const [response] = await connection.query(
      `
      INSERT INTO portfolio_category (name, order_index)
      VALUES (?, ?)
      `,
      [data.name, data.order_index],
    );

    return response.insertId;
  } catch (err) {
    handleDbError(err);
  }
}

export async function getPortfolioCategories() {
  const [rows] = await connection.query(`
    SELECT id, name, order_index, last_update
    FROM portfolio_category
    ORDER BY order_index
  `);

  return rows;
}

export async function getPortfolioCategory(filter = {}) {
  let comando = `
    SELECT id, name, order_index, last_update
    FROM portfolio_category
  `;

  const params = [];

  if (filter.id) {
    comando += ` WHERE id = ?`;
    params.push(filter.id);
  }

  comando += ` LIMIT 1`;

  const [rows] = await connection.query(comando, params);

  return rows[0] ?? null;
}

export async function getPortfolioCategoryById(id) {
  const [rows] = await connection.query(
    `
    SELECT id, name, order_index, last_update
    FROM portfolio_category
    WHERE id = ?
    `,
    [id],
  );

  return rows[0] ?? null;
}

export async function deletePortfolioCategory(id) {
  const [response] = await connection.query(
    `DELETE FROM portfolio_category WHERE id = ?`,
    [id],
  );

  return response.affectedRows;
}
