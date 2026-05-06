import * as service from "../services/mensagemService.js";
import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
const auth = getAuthentication();

endpoints.get("/mensagem", auth, async (req, resp) => {
  // Para buscar uma página específica, use: /mensagem?pagina=2
  const pagina = Number(req.query.pagina) || 1;

  let linhas = await service.listarMensagens(pagina);
  resp.send(linhas);
});

endpoints.post("/mensagem", async (req, resp) => {
  let mensagem = req.body;

  let id = await service.adicionarMensagem(mensagem);

  resp.status(201).send({
    id: id,
  });
});

endpoints.put("/mensagem/:id", auth, async (req, resp) => {
  let id = Number(req.params.id);
  let mensagem = req.body;

  let linhasAfetadas = await service.alterarMensagem(id, mensagem);

  if (linhasAfetadas == 0) {
    resp.status(404).send({
      erro: "Mensagem não encontrada!",
    });
  } else {
    resp.send({ resultado: "Alteração salva com sucesso!" });
  }
});

endpoints.delete("/mensagem/:id", auth, async (req, resp) => {
  let id = Number(req.params.id);

  let linhasAfetadas = await service.deletarMensagem(id);

  if (linhasAfetadas == 0) {
    resp.status(404).send({
      erro: "Mensagem não encontrada!",
    });
  } else {
    resp.status(204).send();
  }
});

endpoints.get("/mensagem/:id", auth, async (req, resp) => {
  let id = Number(req.params.id);

  let linha = await service.buscarMensagemPorId(id);

  if (!linha) {
    resp.status(404).send({
      erro: "Mensagem não encontrada!",
    });
  } else {
    resp.send(linha);
  }
});

export default endpoints;
