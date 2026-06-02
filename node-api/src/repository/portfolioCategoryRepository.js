import connection from "./connection.js";

export async function savePortfolioCategory(data) {
  if (data.id) {
    await connection.query(
      `UPDATE portfolio_category SET name = ?, order_index = ? WHERE id = ?`,
      [data.name, data.order_index, data.id],
    );

    return data.id;
  }

  const [res] = await connection.query(
    `INSERT INTO portfolio_category (name, order_index) VALUES (?, ?)`,
    [data.name, data.order_index],
  );

  return res.insertId;
}

export async function getPortfolioCategories() {
  const [rows] = await connection.query(
    `SELECT * FROM portfolio_category ORDER BY order_index`,
  );

  return rows;
}

export async function getPortfolioCategoryById(id) {
  const [rows] = await connection.query(
    `SELECT * FROM portfolio_category WHERE id = ? LIMIT 1`,
    [id],
  );

  return rows[0] ?? null;
}

export async function deletePortfolioCategory(id) {
  const [res] = await connection.query(
    `DELETE FROM portfolio_category WHERE id = ?`,
    [id],
  );

  return res.affectedRows;
}
