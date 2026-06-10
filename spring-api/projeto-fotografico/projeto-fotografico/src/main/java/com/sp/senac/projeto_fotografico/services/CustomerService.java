package com.sp.senac.projeto_fotografico.services;

import com.sp.senac.projeto_fotografico.models.Customer;
import com.sp.senac.projeto_fotografico.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    public Customer salvar(Customer cliente) {
        return repository.save(cliente);
    }

    public Optional<Customer> buscar(int id) {
        return repository.findById(id);
    }

    public Customer atualizar(Integer id, Customer cliente) {
        cliente.setId(id);
        return repository.save(cliente);
    }

    public void deletar(int id) {
        repository.deleteById(id);
    }

    public Map<String, Object> buscarComFiltro(String category, String name, int page) {
        String cat = (category == null || category.isBlank()) ? "all" : category;
        String nm  = (name     == null)                       ? ""    : name;

        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by("id").descending());
        Page<Customer> result = repository.findWithFilter(cat, nm, pageable);

        Map<String, Object> pagination = Map.of(
                "total",           result.getTotalElements(),
                "itemsPerPage",    result.getSize(),
                "currentPage",     page,
                "totalPages",      result.getTotalPages(),
                "hasNextPage",     result.hasNext(),
                "hasPreviousPage", result.hasPrevious()
        );

        return Map.of(
                "customers",   result.getContent(),
                "pagination", pagination
        );
    }
}