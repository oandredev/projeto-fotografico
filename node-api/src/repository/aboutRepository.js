import connection from "./connection.js";

export async function saveAbout(data) {
  const [existing] = await connection.query(`
    SELECT id
      FROM about
     LIMIT 1
  `);

  if (existing.length > 0) {
    const aboutId = existing[0].id;

    const comando = `
      UPDATE about
         SET presentationText = ?,
             imageUrl = ?
       WHERE id = ?
    `;

    const [response] = await connection.query(comando, [
      data.presentationText,
      data.imageUrl,
      aboutId,
    ]);

    return response.affectedRows;
  }

  const comando = `
    INSERT INTO about (
      presentationText,
      imageUrl
    )
    VALUES (?, ?)
  `;

  const [response] = await connection.query(comando, [
    data.presentationText,
    data.imageUrl,
  ]);

  return response.insertId;
}

export async function getAbout() {
  const comando = `
    SELECT
      id,
      presentationText,
      imageUrl,
      lastUpdate
    FROM about
    LIMIT 1
  `;

  const [rows] = await connection.query(comando);

  return rows[0] || null;
}

export async function deleteAbout(id) {
  const comando = `
    DELETE FROM about
     WHERE id = ?
  `;

  const [response] = await connection.query(comando, [id]);

  return response.affectedRows;
}

export async function getAboutById(id) {
  const comando = `
    SELECT
      id,
      presentationText,
      imageUrl,
      lastUpdate
    FROM about
    WHERE id = ?
  `;

  const [rows] = await connection.query(comando, [id]);

  return rows[0] || null;
}
