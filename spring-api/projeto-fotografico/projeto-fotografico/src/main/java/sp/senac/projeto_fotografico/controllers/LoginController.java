package sp.senac.projeto_fotografico.controllers;

import sp.senac.projeto_fotografico.models.Login;
import sp.senac.projeto_fotografico.services.LoginService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private LoginService service;

    @PostMapping
    public Login salvar(@RequestBody Login conta) {
        return service.salvar(conta);
    }

    @GetMapping
    public List<Login> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Optional<Login> buscar(@PathVariable int id) {
        return service.buscar(id);
    }

    @PutMapping("/{id}")
    public Login atualizar(@PathVariable int id, @RequestBody Login conta) {
        return service.atualizar(id, conta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable int id) {
        service.deletar(id);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/email")
    public ResponseEntity<Login> buscarPorEmail(@RequestParam String email) {
        Optional<Login> login = service.buscar(email);
        return login.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    
    
}
