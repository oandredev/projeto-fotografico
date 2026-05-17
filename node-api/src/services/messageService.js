import * as repo from "../repository/messageRepository.js";

export async function addMessage(message) {
  let id = await repo.addMessage(message);
  return id;
}

export async function getMessages(filter) {
  let result = await repo.getMessages(filter);
  return result;
}

export async function updateMessage(id, message) {
  let linhasAfetadas = await repo.updateMessage(id, message);
  return linhasAfetadas;
}

export async function deleteMessage(id) {
  let lines = await repo.deleteMessage(id);
  return lines;
}

export async function getMessageById(id) {
  let line = await repo.getMessageById(id);
  return line;
}
