import connection from "./connection.js";

export async function criarConta(login) {
  const comando = `
    INSERT INTO LOGIN (email, senha)
    VALUES (?, MD5(?));
  `;

  const [resposta] = await connection.query(comando, [
    login.email,
    login.senha,
  ]);

  return resposta.insertId;
}

export async function login(email, senha) {
  let comando = `
    SELECT id,
           email
      FROM login
      WHERE email = ?
      AND senha = MD5(?)
  `;

  const [linhas] = await connection.query(comando, [email, senha]);
  return linhas[0];
}

export async function buscarPorEmail(email) {
  const comando = `
    SELECT * FROM login WHERE email = ?
  `;

  const [linhas] = await connection.query(comando, [email]);
  return linhas[0];
}
