package sp.senac.projeto_fotografico.controllers;

import sp.senac.projeto_fotografico.models.Customer;
import sp.senac.projeto_fotografico.services.CustomerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    
    @Autowired
    private CustomerService service;

    @PostMapping
    public Customer salvar(@RequestBody Customer cliente) {
        return service.salvar(cliente);
    }

    @GetMapping
    public List<Customer> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Optional<Customer> buscar(@PathVariable int id) {
        return service.buscar(id);
    }

    @PutMapping("/{id}")
    public Customer atualizar(@PathVariable int id, @RequestBody Customer cliente) {
        return service.atualizar(id, cliente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable int id) {
        service.deletar(id);

        return ResponseEntity.ok().build();
    }

     @GetMapping("/filtros")
    public Page<Customer> buscarClientesFiltrados(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean isStarred,
            @RequestParam(required = false) Boolean isArchived,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return service.buscarClientesFiltrados(name, isStarred, isArchived, pageable);
    }

    @GetMapping("/starred")
    public List<Customer> buscarClientesComEstrela() {
        return service.buscarClientesComEstrela();
    }

    @GetMapping("/archived")
    public List<Customer> buscarClientesArquivados() {
        return service.buscarClientesArquivados();
    }

    @GetMapping("/search/nome")
    public List<Customer> buscarClientePorNome(@RequestParam String name) {
        return service.buscarClientePorNome(name);
    }

    @GetMapping("/ativos/starred")
    public Page<Customer> buscarClientesAtivosComEstrela(
            @RequestParam(required = false) String name,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return service.buscarClientesAtivosComEstrela(name, pageable);
    }

}
