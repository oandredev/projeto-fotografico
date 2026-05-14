import connection from "./connection.js";

export async function criarConta(login) {
  const comando = `
    INSERT INTO login (email, password)
    VALUES (?, MD5(?));
  `;

  const [resposta] = await connection.query(comando, [
    login.email,
    login.password,
  ]);

  return resposta.insertId;
}

export async function login(email, password) {
  let comando = `
    SELECT id,
           email
      FROM login
      WHERE email = ?
      AND password = MD5(?)
  `;

  const [linhas] = await connection.query(comando, [email, password]);

  return linhas[0];
}

export async function buscarPorEmail(email) {
  const comando = `
    SELECT * FROM login WHERE email = ?
  `;

  const [linhas] = await connection.query(comando, [email]);
  return linhas[0];
}
