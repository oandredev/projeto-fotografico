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
    public ResponseEntity<?> salvar(@RequestBody Customer cliente) {
        try {
            return ResponseEntity.status(201).body(service.salvar(cliente));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public Map<String, Object> listar(
            @RequestParam(defaultValue = "all") String category,
            @RequestParam(defaultValue = "")    String name,
            @RequestParam(defaultValue = "1")   int page) {
        return service.buscarComFiltro(category, name, page);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(service.getStats());
    }

    @GetMapping("/{id}")
    public Optional<Customer> buscar(@PathVariable int id) {
        return service.buscar(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable int id, @RequestBody Customer cliente) {
        try {
            return ResponseEntity.ok(service.atualizar(id, cliente));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable int id) {
        service.deletar(id);
        return ResponseEntity.ok().build();
    }
}