package sp.senac.projeto_fotografico.controllers;

import sp.senac.projeto_fotografico.models.Message;
import sp.senac.projeto_fotografico.services.MessageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import java.util.List;
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
    public List<Message> listar() {
        return service.listar();
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

    @GetMapping("/filtros")
    public Page<Message> buscarComFiltro(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String name,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return service.buscarComFiltro(category, name, pageable);
    }
    
}
