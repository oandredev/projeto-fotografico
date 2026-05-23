import connection from "./connection.js";

export async function saveHero(data) {
  const [existing] = await connection.query(`SELECT id FROM hero LIMIT 1`);

  if (existing.length > 0) {
    const heroId = existing[0].id;

    const [response] = await connection.query(
      `UPDATE hero SET slogan = ?, imageUrls = ? WHERE id = ?`,
      [data.slogan, data.imageUrls, heroId],
    );

    return heroId;
  }

  const [response] = await connection.query(
    `INSERT INTO hero (slogan, imageUrls) VALUES (?, ?)`,
    [data.slogan, data.imageUrls],
  );

  return response.insertId;
}

export async function getHero(filter = {}) {
  let comando = `SELECT id, slogan, imageUrls, createdAt, lastUpdate FROM hero`;
  const params = [];

  if (filter.id) {
    comando += ` WHERE id = ?`;
    params.push(filter.id);
  }

  comando += ` LIMIT 1`;

  const [rows] = await connection.query(comando, params);

  if (!rows[0]) return null;

  return {
    ...rows[0],
    imageUrls:
      typeof rows[0].imageUrls === "string"
        ? JSON.parse(rows[0].imageUrls)
        : (rows[0].imageUrls ?? []),
  };
}

export async function getHeroById(id) {
  const [rows] = await connection.query(
    `SELECT id, slogan, imageUrls, createdAt, lastUpdate FROM hero WHERE id = ?`,
    [id],
  );

  if (!rows[0]) return null;

  return {
    ...rows[0],
    imageUrls:
      typeof rows[0].imageUrls === "string"
        ? JSON.parse(rows[0].imageUrls)
        : (rows[0].imageUrls ?? []),
  };
}

export async function deleteHero(id) {
  const [response] = await connection.query(`DELETE FROM hero WHERE id = ?`, [
    id,
  ]);
  return response.affectedRows;
}
