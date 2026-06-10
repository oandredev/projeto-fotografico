package com.sp.senac.projeto_fotografico.controllers;

import com.sp.senac.projeto_fotografico.models.Message;
import com.sp.senac.projeto_fotografico.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private MessageService service;

    @PostMapping
    public Message salvar(@RequestBody Message mensagem) {
        return service.salvar(mensagem);
    }

    @GetMapping
    public Map<String, Object> listar(
            @RequestParam(defaultValue = "all") String category,
            @RequestParam(defaultValue = "")    String name,
            @RequestParam(defaultValue = "1")   int page) {
        return service.buscarComFiltro(category, name, page);
    }

    @GetMapping("/{id}")
    public Optional<Message> buscar(@PathVariable int id) {
        return service.buscar(id);
    }

    @PutMapping("/{id}")
    public Message atualizar(@PathVariable int id, @RequestBody Message mensagem) {
        return service.atualizar(id, mensagem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable int id) {
        service.deletar(id);
        return ResponseEntity.ok().build();
    }
}
