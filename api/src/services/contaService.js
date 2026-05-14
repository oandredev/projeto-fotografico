import * as repo from "../repository/contaRepository.js";

export async function criarConta(login) {
  let existe = await repo.buscarPorEmail(login.email);
  if (existe) {
    throw new Error("Email já cadastrado por outro usuário.");
  }

  let id = await repo.criarConta(login);
  return id;
}

export async function login(email, password) {
  let usu = await repo.login(email, password);
  if (!usu) {
    throw new Error("Credenciais inválidas.");
  }
  return usu;
}
