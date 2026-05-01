import * as repo from "../repository/loginRepository.js";

export async function criarConta(login) {
  let existe = await repo.buscarPorEmail(login.email);
  if (existe) {
    throw new Error("Email já cadastrado por outro usuário.");
  }

  let id = await repo.criarConta(login);
  return id;
}

export async function login(email, senha) {
  let usu = await repo.login(email, senha);
  if (!usu) {
    throw new Error("Credenciais inválidas.");
  }
  return usu;
}
