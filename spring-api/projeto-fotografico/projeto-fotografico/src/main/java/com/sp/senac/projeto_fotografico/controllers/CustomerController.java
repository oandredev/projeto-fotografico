package com.sp.senac.projeto_fotografico.controllers;

import com.sp.senac.projeto_fotografico.models.Customer;
import com.sp.senac.projeto_fotografico.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
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
    public Map<String, Object> listar(
            @RequestParam(defaultValue = "all") String category,
            @RequestParam(defaultValue = "")    String name,
            @RequestParam(defaultValue = "1")   int page) {
        return service.buscarComFiltro(category, name, page);
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
}