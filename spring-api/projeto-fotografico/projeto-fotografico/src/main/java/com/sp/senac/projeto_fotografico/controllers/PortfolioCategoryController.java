package com.sp.senac.projeto_fotografico.controllers;

import com.sp.senac.projeto_fotografico.dto.PortfolioCategoryRequest;
import com.sp.senac.projeto_fotografico.services.PortfolioCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/portfolio-category")
public class PortfolioCategoryController {

    @Autowired
    private PortfolioCategoryService service;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(
                service.getPortfolioCategories()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @PathVariable int id
    ) {
        return service.getPortfolioCategoryById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.status(404)
                                .body(Map.of("error", "Category not found"))
                );
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody PortfolioCategoryRequest request
    ) {
        try {
            service.create(request);
            return ResponseEntity.status(201)
                    .body(Map.of("result", "Saved"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable int id,
            @RequestBody PortfolioCategoryRequest request
    ) {
        try {
            service.update(id, request);
            return ResponseEntity.ok(Map.of("result", "Updated"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable int id
    ) {
        try {
            service.delete(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<?> incrementView(
            @PathVariable int id
    ) {
        try {
            service.incrementViews(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}