package sp.senac.projeto_fotografico.services;

import sp.senac.projeto_fotografico.models.Login;
import sp.senac.projeto_fotografico.repositories.LoginRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoginService {
    
    @Autowired
    private LoginRepository repository;

    public Login salvar(Login conta) {
        return repository.save(conta);
    }

    public List<Login> listar() {
        return repository.findAll();
    }

    public Optional<Login> buscar(int id) {
        return repository.findById(id);
    }

    public Optional<Login> buscar(String email) {
        return repository.findByEmail(email);
    }

    public Login atualizar(Integer id, Login conta) {
        conta.setId(id);
        return repository.save(conta);
    }

    public void deletar(int id) {
        repository.deleteById(id);
    }

}
