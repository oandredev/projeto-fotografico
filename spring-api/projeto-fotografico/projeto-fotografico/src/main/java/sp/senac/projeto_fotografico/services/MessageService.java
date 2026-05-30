package sp.senac.projeto_fotografico.services;

import sp.senac.projeto_fotografico.models.Message;
import sp.senac.projeto_fotografico.repositories.MessageRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository repository;

    public Message salvar(Message mensagem) {
        return repository.save(mensagem);
    }

    public List<Message> listar() {
        return repository.findAll();
    }

    public Optional<Message> buscar(int id) {
        return repository.findById(id);
    }

    public Page<Message> buscarComFiltro(String category, String name, Pageable pageable) {
        return repository.findMessagesWithFilter(category, name, pageable);
    }

    public Message atualizar(Integer id, Message mensagem) {
        mensagem.setId(id);
        return repository.save(mensagem);
    }

    public void deletar(int id) {
        repository.deleteById(id);
    }
}
