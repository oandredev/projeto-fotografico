package com.sp.senac.projeto_fotografico.repositories;

import com.sp.senac.projeto_fotografico.models.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioRepository
        extends JpaRepository<Portfolio, Integer> {

    List<Portfolio> findByCategory_Id(Integer categoryId);

    boolean existsByCategory_Id(Integer categoryId);
}