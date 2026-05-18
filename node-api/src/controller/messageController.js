import * as service from "../services/messageService.js";
import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
const auth = getAuthentication();

endpoints.get("/message", async (req, resp) => {
  const filter = req.query;

  let result = await service.getMessages(filter);
  resp.send(result);
});

endpoints.post("/message", async (req, resp) => {
  let message = req.body;

  let id = await service.addMessage(message);

  resp.status(201).send({
    id: id,
  });
});

endpoints.put("/message/:id", auth, async (req, resp) => {
  let id = Number(req.params.id);
  let message = req.body;

  let lines = await service.updateMessage(id, message);

  if (lines == 0) {
    resp.status(404).send({
      error: "Message not found",
    });
  } else {
    resp.send({ result: "Change saved successfully!" });
  }
});

endpoints.delete("/message/:id", auth, async (req, resp) => {
  let id = Number(req.params.id);

  let lines = await service.deleteMessage(id);

  if (lines == 0) {
    resp.status(404).send({
      error: "Message not found",
    });
  } else {
    resp.status(204).send();
  }
});

endpoints.get("/message/:id", auth, async (req, resp) => {
  let id = Number(req.params.id);

  let line = await service.getMessageById(id);

  if (!line) {
    resp.status(404).send({
      error: "Message not found",
    });
  } else {
    resp.send(line);
  }
});

export default endpoints;
