import connection from "./connection.js";

function parseImages(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export async function savePortfolio(data) {
  if (data.id) {
    await connection.query(
      `
      UPDATE portfolio
      SET category_id = ?, image_urls = ?
      WHERE id = ?
      `,
      [data.category_id, JSON.stringify(data.image_urls ?? []), data.id],
    );

    return data.id;
  }

  const [res] = await connection.query(
    `
    INSERT INTO portfolio (category_id, image_urls)
    VALUES (?, ?)
    `,
    [data.category_id, JSON.stringify(data.image_urls ?? [])],
  );

  return res.insertId;
}

export async function getPortfolios() {
  const [rows] = await connection.query(`
    SELECT p.id, p.category_id, p.image_urls, p.last_update,
           c.name AS category_name, c.order_index
    FROM portfolio p
    INNER JOIN portfolio_category c ON c.id = p.category_id
    ORDER BY c.order_index
  `);

  return rows.map((r) => ({
    ...r,
    image_urls: parseImages(r.image_urls),
  }));
}

export async function getPortfolioById(id) {
  const [rows] = await connection.query(
    `SELECT * FROM portfolio WHERE id = ? LIMIT 1`,
    [id],
  );

  if (!rows[0]) return null;

  return {
    ...rows[0],
    image_urls: parseImages(rows[0].image_urls),
  };
}

export async function getPortfoliosByCategory(categoryId) {
  const [rows] = await connection.query(
    `SELECT * FROM portfolio WHERE category_id = ?`,
    [categoryId],
  );

  return rows.map((r) => ({
    ...r,
    image_urls: parseImages(r.image_urls),
  }));
}

export async function deletePortfolio(id) {
  const [res] = await connection.query(`DELETE FROM portfolio WHERE id = ?`, [
    id,
  ]);

  return res.affectedRows;
}

// Stats (Calleds from portfolioService together with getStats)

export async function getPortfolioStats() {
  const totalsQuery = `
    SELECT
      COUNT(DISTINCT category_id) categoriasAtivas,
      COALESCE(SUM(JSON_LENGTH(image_urls)),0) fotosArmazenadas
    FROM portfolio;
  `;

  const [totals] = await connection.query(totalsQuery);

  return totals[0];
}

export async function getPortfolioCategoryStats() {
  const query = `
    SELECT
      p.category_id,
      JSON_LENGTH(p.image_urls) photos,
      c.views
    FROM portfolio p
    INNER JOIN portfolio_category c
            ON c.id = p.category_id;
  `;

  const [result] = await connection.query(query);

  return result;
}
