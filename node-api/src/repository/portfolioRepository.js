import connection from "./connection.js";

function handleDbError(err) {
  if (err.code === "ER_DUP_ENTRY") {
    if (err.message.includes("category_id")) {
      const error = new Error("Category already has a portfolio");
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

export async function savePortfolio(data) {
  try {
    if (data.id) {
      await connection.query(
        `
        UPDATE portfolio
        SET category_id = ?, image_urls = ?
        WHERE id = ?
        `,
        [data.category_id, JSON.stringify(data.image_urls), data.id],
      );

      return data.id;
    }

    const [response] = await connection.query(
      `
      INSERT INTO portfolio
      (category_id, image_urls)
      VALUES (?, ?)
      `,
      [data.category_id, JSON.stringify(data.image_urls)],
    );

    return response.insertId;
  } catch (err) {
    handleDbError(err);
  }
}

export async function getPortfolios() {
  const [rows] = await connection.query(`
    SELECT
      p.id,
      p.category_id,
      p.image_urls,
      p.last_update,
      c.name category_name
    FROM portfolio p
    INNER JOIN portfolio_category c
      ON c.id = p.category_id
    ORDER BY c.order_index
  `);

  return rows.map((item) => ({
    ...item,
    image_urls: JSON.parse(item.image_urls),
  }));
}

export async function getPortfolio(filter = {}) {
  let command = `
    SELECT
      id,
      category_id,
      image_urls,
      last_update
    FROM portfolio
  `;

  const params = [];

  if (filter.id) {
    command += " WHERE id = ?";
    params.push(filter.id);
  }

  command += " LIMIT 1";

  const [rows] = await connection.query(command, params);

  if (!rows[0]) return null;

  return {
    ...rows[0],
    image_urls: JSON.parse(rows[0].image_urls),
  };
}

export async function getPortfolioById(id) {
  const [rows] = await connection.query(
    `
    SELECT
      id,
      category_id,
      image_urls,
      last_update
    FROM portfolio
    WHERE id = ?
    `,
    [id],
  );

  if (!rows[0]) return null;

  return {
    ...rows[0],
    image_urls: JSON.parse(rows[0].image_urls),
  };
}

export async function getPortfolioByCategory(categoryId) {
  const [rows] = await connection.query(
    `
    SELECT
      id,
      category_id,
      image_urls,
      last_update
    FROM portfolio
    WHERE category_id = ?
    `,
    [categoryId],
  );

  if (!rows[0]) return null;

  return {
    ...rows[0],
    image_urls: JSON.parse(rows[0].image_urls),
  };
}

export async function deletePortfolio(id) {
  const [response] = await connection.query(
    `DELETE FROM portfolio WHERE id = ?`,
    [id],
  );

  return response.affectedRows;
}
