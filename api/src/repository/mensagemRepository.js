import connection from "./connection.js";

export async function salvarMensagem(mensagem) {
  const comando = `
    INSERT INTO mensagem (nome, cpf, telefone, email, texto, data)
    VALUES (?, ?, ?, ?, ?, NOW());
  `;

  const [resposta] = await connection.query(comando, [
    mensagem.nome,
    mensagem.cpf,
    mensagem.telefone,
    mensagem.email,
    mensagem.texto,
  ]);

  return resposta.insertId;
}

export async function listarMensagens(pagina) {
  const limite = 10;
  const offset = (pagina - 1) * limite;

  if (pagina <= 0 || offset < 0) {
    return "Página inválida!";
  }

  const comando = `
    SELECT *
      FROM mensagem
     ORDER BY data DESC
     LIMIT 10 OFFSET ?;
  `;

  const [linhas] = await connection.query(comando, [offset]);
  return linhas;
}

export async function alterarMensagem(id, mensagem) {
  const comando = `
    UPDATE mensagem
       SET nome = ?,
           cpf = ?,
           telefone = ?,
           email = ?,
           texto = ?,
           categoria = ?
     WHERE id = ?
  `;

  const [resposta] = await connection.query(comando, [
    mensagem.nome,
    mensagem.cpf,
    mensagem.telefone,
    mensagem.email,
    mensagem.texto,
    mensagem.categoria,
    id,
  ]);

  return resposta.affectedRows;
}

export async function deletarMensagem(id) {
  const comando = `DELETE FROM mensagem WHERE id = ?`;

  const [resposta] = await connection.query(comando, [id]);
  return resposta.affectedRows;
}

export async function buscarMensagemPorId(id) {
  const comando = `SELECT * FROM mensagem WHERE id = ?`;

  const [linhas] = await connection.query(comando, [id]);
  return linhas[0];
}
