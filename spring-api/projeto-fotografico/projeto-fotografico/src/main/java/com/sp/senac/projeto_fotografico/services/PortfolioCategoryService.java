package com.sp.senac.projeto_fotografico.services;

import com.sp.senac.projeto_fotografico.dto.PortfolioCategoryRequest;
import com.sp.senac.projeto_fotografico.models.PortfolioCategory;
import com.sp.senac.projeto_fotografico.repositories.PortfolioCategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PortfolioCategoryService {

    @Autowired
    private PortfolioCategoryRepository repository;

    public List<PortfolioCategory> getPortfolioCategories() {
        return repository.findAll()
                .stream()
                .sorted((a, b) ->
                        a.getOrderIndex().compareTo(b.getOrderIndex()))
                .toList();
    }

    public Optional<PortfolioCategory> getPortfolioCategoryById(int id) {
        return repository.findById(id);
    }

    public void create(PortfolioCategoryRequest request) {

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }

        if (request.getOrderIndex() == null) {
            throw new IllegalArgumentException("Order index is required");
        }

        PortfolioCategory category = new PortfolioCategory();
        category.setName(request.getName());
        category.setOrderIndex(request.getOrderIndex());
        category.setViews(0);

        repository.save(category);
    }

    public void update(int id, PortfolioCategoryRequest request) {

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }

        if (request.getOrderIndex() == null) {
            throw new IllegalArgumentException("Order index is required");
        }

        PortfolioCategory existing = repository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found"));

        existing.setName(request.getName());
        existing.setOrderIndex(request.getOrderIndex());

        repository.save(existing);
    }

    public void delete(int id) {

        PortfolioCategory category = repository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found"));

        repository.delete(category);
    }

    @Transactional
    public void incrementViews(int id) {

        PortfolioCategory category = repository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found"));

        category.setViews(
                (category.getViews() == null ? 0 : category.getViews()) + 1
        );

        repository.save(category);
    }
}