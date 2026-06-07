import connection from "./connection.js";

export async function addMessage(mensagem) {
  const comando = `
    INSERT INTO message (name, phone, email, subject, body)
    VALUES (?, ?, ?, ?, ?);
  `;

  const [resposta] = await connection.query(comando, [
    mensagem.name,
    mensagem.phone,
    mensagem.email,
    mensagem.subject || null,
    mensagem.body,
  ]);

  return resposta.insertId;
}

export async function getMessages(filter = {}) {
  const { page = 1, name = "", category = "inbox" } = filter;
  const currentPage = Number(page);
  const itemsPerPage = 5;
  const offset = (currentPage - 1) * itemsPerPage;

  if (isNaN(currentPage) || currentPage <= 0) {
    throw new Error("Invalid page");
  }

  let conditions = [];
  let values = [];

  // CATEGORY
  if (category === "inbox") {
    conditions.push("isArchived = 0");
  } else if (category === "starred") {
    conditions.push("isStarred = 1");
  } else if (category === "archived") {
    conditions.push("isArchived = 1");
  }

  // NAME

  if (name.trim() !== "") {
    conditions.push("name LIKE ?");
    values.push(`%${name}%`);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // MESSAGES

  const query = `
    SELECT
      id,
      name,
      phone,
      email,
      subject,
      body,
      isStarred = 1 AS isStarred,
      isArchived = 1 AS isArchived,
      date
    FROM message
    ${where}
    ORDER BY id DESC
    LIMIT ? OFFSET ?;
  `;

  const [messages] = await connection.query(query, [
    ...values,
    itemsPerPage,
    offset,
  ]);

  // TOTAL

  const countQuery = `
    SELECT
      COUNT(*) AS total
    FROM message
    ${where};
  `;

  const [countResult] = await connection.query(countQuery, values);
  const total = Number(countResult[0].total);
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  return {
    messages,
    pagination: {
      total,
      itemsPerPage,
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
}

export async function updateMessage(id, mensagem) {
  const comando = `
    UPDATE message
       SET name = ?,
           phone = ?,
           email = ?,
           subject = ?,
           body = ?,
           isStarred = ?,
           isArchived = ?
     WHERE id = ?
  `;

  const [resposta] = await connection.query(comando, [
    mensagem.name,
    mensagem.phone,
    mensagem.email,
    mensagem.subject,
    mensagem.body,
    mensagem.isStarred ? 1 : 0,
    mensagem.isArchived ? 1 : 0,
    id,
  ]);

  return resposta.affectedRows;
}

export async function deleteMessage(id) {
  const comando = `DELETE FROM message WHERE id = ?`;
  const [resposta] = await connection.query(comando, [id]);
  return resposta.affectedRows;
}

export async function getMessageById(id) {
  const comando = `
    SELECT id, name, phone, email, subject, body, 
           isStarred = 1 AS isStarred, 
           isArchived = 1 AS isArchived, 
           date 
      FROM message 
     WHERE id = ?
  `;

  const [linhas] = await connection.query(comando, [id]);
  return linhas[0];
}

export async function getMessageStats() {
  const query = `
    SELECT
      COUNT(*) AS total,
    
      SUM(isStarred = 1) AS favoritas,
      SUM(isArchived = 1) AS arquivadas,
      SUM(isArchived = 0) AS ativas,
    
      SUM(DATE(date) = CURDATE()) AS day,
    
      SUM(date >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS week,
    
      SUM(date >= DATE_SUB(NOW(), INTERVAL 30 DAY)) AS month,
    
      SUM(date >= DATE_SUB(NOW(), INTERVAL 365 DAY)) AS year

    FROM message;
  `;

  const [result] = await connection.query(query);

  return result[0];
}
