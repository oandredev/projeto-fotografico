package com.sp.senac.projeto_fotografico.repositories;

import com.sp.senac.projeto_fotografico.models.Hero;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HeroRepository extends JpaRepository<Hero, Integer> {
}