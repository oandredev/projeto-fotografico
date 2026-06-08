import connection from "./connection.js";

export async function addCustomer(customer) {
  const comando = `
    INSERT INTO customer (
      name,
      cpf,
      phone,
      email,
      birthDate
    )
    VALUES (?, ?, ?, ?, ?);
  `;

  const [resposta] = await connection.query(comando, [
    customer.name,
    customer.cpf,
    customer.phone,
    customer.email,
    customer.birthDate,
  ]);

  return resposta;
}

export async function getCustomerStats() {
  const query = `
    SELECT
      COUNT(*) AS total,

      SUM(isArchived = 0) AS geral,
      SUM(isStarred = 1) AS favoritos,
      SUM(isArchived = 1) AS arquivados,

      SUM(DATE(\`register\`) = CURDATE()) AS day,
      SUM(\`register\` >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS week,
      SUM(\`register\` >= DATE_SUB(NOW(), INTERVAL 1 MONTH)) AS month,
      SUM(\`register\` >= DATE_SUB(NOW(), INTERVAL 1 YEAR)) AS year

    FROM customer
  `;

  const [result] = await connection.query(query);

  return result[0];
}

export async function getCustomers(filter = {}) {
  const { page = 1, name = "", category = "all" } = filter;

  const currentPage = Number(page);
  const itemsPerPage = 50;
  const offset = (currentPage - 1) * itemsPerPage;

  if (isNaN(currentPage) || currentPage <= 0) {
    throw new Error("Invalid page");
  }

  let conditions = [];
  let values = [];

  // CATEGORY
  if (category === "starred") {
    conditions.push("isStarred = 1");
  } else if (category === "archived") {
    conditions.push("isArchived = 1");
  }

  // SEARCH
  if (name.trim() !== "") {
    const term = `%${name.trim()}%`;
    const termExact = name.trim();

    conditions.push(`(
      name  LIKE ? OR
      cpf   LIKE ? OR
      phone LIKE ? OR
      email LIKE ? OR
      id    = ?
    )`);

    values.push(term, term, term, term, termExact);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // CUSTOMERS
  const query = `
    SELECT
      id,
      name,
      cpf,
      phone,
      email,
      birthDate,
      isStarred = 1 AS isStarred,
      isArchived = 1 AS isArchived,
      register
    FROM customer
    ${where}
    ORDER BY id DESC
    LIMIT ? OFFSET ?;
  `;

  const [customers] = await connection.query(query, [
    ...values,
    itemsPerPage,
    offset,
  ]);

  // TOTAL
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM customer
    ${where};
  `;

  const [countResult] = await connection.query(countQuery, values);

  const total = Number(countResult[0].total);
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  return {
    customers,
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

export async function updateCustomer(id, customer) {
  const comando = `
    UPDATE customer
       SET name = ?,
           cpf = ?,
           phone = ?,
           email = ?,
           birthDate = ?,
           isStarred = ?,
           isArchived = ?
     WHERE id = ?
  `;

  const [resposta] = await connection.query(comando, [
    customer.name,
    customer.cpf,
    customer.phone,
    customer.email,
    customer.birthDate,
    customer.isStarred ? 1 : 0,
    customer.isArchived ? 1 : 0,
    id,
  ]);

  return resposta.affectedRows;
}

export async function deleteCustomer(id) {
  const comando = `
    DELETE FROM customer
    WHERE id = ?
  `;

  const [resposta] = await connection.query(comando, [id]);

  return resposta.affectedRows;
}

export async function getCustomerById(id) {
  const comando = `
    SELECT
      id,
      name,
      cpf,
      phone,
      email,
      birthDate,
      isStarred = 1 AS isStarred,
      isArchived = 1 AS isArchived,
      register
    FROM customer
    WHERE id = ?
  `;

  const [linhas] = await connection.query(comando, [id]);

  return linhas[0];
}
