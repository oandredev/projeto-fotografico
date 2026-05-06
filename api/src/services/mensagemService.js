import * as repo from "../repository/mensagemRepository.js";

export async function adicionarMensagem(mensagem) {
  let id = await repo.salvarMensagem(mensagem);
  return id;
}

export async function listarMensagens(pagina) {
  let linhas = await repo.listarMensagens(pagina);
  return linhas;
}

export async function alterarMensagem(id, mensagem) {
  let linhasAfetadas = await repo.alterarMensagem(id, mensagem);
  return linhasAfetadas;
}

export async function deletarMensagem(id) {
  let linhasAfetadas = await repo.deletarMensagem(id);
  return linhasAfetadas;
}

export async function buscarMensagemPorId(id) {
  let linha = await repo.buscarMensagemPorId(id);
  return linha;
}
