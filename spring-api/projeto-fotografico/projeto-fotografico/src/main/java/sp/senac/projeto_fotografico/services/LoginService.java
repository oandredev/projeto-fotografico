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
    if (conta.getPassword() != null && !conta.getPassword().isEmpty()) {
        conta.setPassword(md5(conta.getPassword()));
    }
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
        conta.setPassword(md5(conta.getPassword()));
        return repository.save(conta);
    }

    public void deletar(int id) {
        repository.deleteById(id);
    }

    private String md5(String input) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash MD5", e);
        }
    }

}
