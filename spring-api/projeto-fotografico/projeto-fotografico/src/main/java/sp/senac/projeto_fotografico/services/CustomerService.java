package sp.senac.projeto_fotografico.services;

import sp.senac.projeto_fotografico.models.Customer;
import sp.senac.projeto_fotografico.repositories.CustomerRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    public Customer salvar(Customer cliente) {
        return repository.save(cliente);
    }

    public List<Customer> listar() {
        return repository.findAll();
    }

    public Optional<Customer> buscar(int id) {
        return repository.findById(id);
    }

        public Page<Customer> buscarClientesFiltrados(String name, Boolean isStarred, 
                                               Boolean isArchived, Pageable pageable) {
        return repository.findCustomersWithFilters(name, isStarred, isArchived, pageable);
    }
    
    // Chamar função que busca starred customers
    public List<Customer> buscarClientesComEstrela() {
        return repository.findByIsStarredTrue();
    }
    
    // Chamar função que busca archived customers
    public List<Customer> buscarClientesArquivados() {
        return repository.findByIsArchivedTrue();
    }
    
    // Chamar função que busca por nome (case insensitive)
    public List<Customer> buscarClientePorNome(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }
    
    // Exemplo de uso combinado
    public Page<Customer> buscarClientesAtivosComEstrela(String name, Pageable pageable) {
        // Exemplo: buscar apenas starred, não archived
        return repository.findCustomersWithFilters(name, true, false, pageable);
    }

    public Customer atualizar(Integer id, Customer cliente) {
        cliente.setId(id);
        return repository.save(cliente);
    }

    public void deletar(int id) {
        repository.deleteById(id);
    }    
}
