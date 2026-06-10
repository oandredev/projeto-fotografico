package com.sp.senac.projeto_fotografico.repositories;

import com.sp.senac.projeto_fotografico.models.PortfolioCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioCategoryRepository
        extends JpaRepository<PortfolioCategory, Integer> {
}