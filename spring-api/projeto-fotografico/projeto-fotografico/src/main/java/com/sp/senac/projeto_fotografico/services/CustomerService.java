package com.sp.senac.projeto_fotografico.services;

import com.sp.senac.projeto_fotografico.dto.CustomerStatsResponse;
import com.sp.senac.projeto_fotografico.models.Customer;
import com.sp.senac.projeto_fotografico.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    public Customer salvar(Customer cliente) {
        try {
            return repository.save(cliente);
        } catch (DataIntegrityViolationException e) {
            String msg = e.getRootCause() != null
                    ? e.getRootCause().getMessage().toLowerCase()
                    : "";
            if (msg.contains("cpf")) {
                throw new IllegalArgumentException("CPF já cadastrado para outro cliente");
            }
            throw new IllegalArgumentException("Registro duplicado");
        }
    }

    public Optional<Customer> buscar(int id) {
        return repository.findById(id);
    }

    public Customer atualizar(Integer id, Customer cliente) {
        try {
            cliente.setId(id);
            return repository.save(cliente);
        } catch (DataIntegrityViolationException e) {
            String msg = e.getRootCause() != null
                    ? e.getRootCause().getMessage().toLowerCase()
                    : "";
            if (msg.contains("cpf")) {
                throw new IllegalArgumentException("CPF já cadastrado para outro cliente");
            }
            throw new IllegalArgumentException("Registro duplicado");
        }
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

    public CustomerStatsResponse getStats() {
        LocalDateTime now = LocalDateTime.now();

        long total     = repository.countBy();
        long geral     = repository.countByIsStarredFalseAndIsArchivedFalse();
        long favoritos = repository.countByIsStarredTrue();
        long arquivados = repository.countByIsArchivedTrue();

        long day   = repository.countByRegisterAfter(now.minusDays(1));
        long week  = repository.countByRegisterAfter(now.minusDays(7));
        long month = repository.countByRegisterAfter(now.minusDays(30));
        long year  = repository.countByRegisterAfter(now.minusDays(365));

        return new CustomerStatsResponse(
                total, geral, favoritos, arquivados,
                day, week, month, year
        );
    }
}