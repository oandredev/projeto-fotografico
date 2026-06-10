package com.sp.senac.projeto_fotografico.services;

import com.sp.senac.projeto_fotografico.models.Hero;
import com.sp.senac.projeto_fotografico.repositories.HeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class HeroService {

    @Autowired
    private HeroRepository repository;

    public Optional<Hero> getHero() {
        return repository.findAll().stream().findFirst();
    }
    public Optional<Hero> getHeroById(int id) {
        return repository.findById(id);
    }

    public Hero update(
            int id,
            String slogan,
            List<String> imageUrls
    ) {

        if (slogan == null || slogan.isBlank()) {
            throw new IllegalArgumentException("Slogan is required");
        }

        Hero hero = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Hero not found"));

        hero.setSlogan(slogan);
        hero.setImageUrls(imageUrls);

        return repository.save(hero);
    }

    public void delete(int id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Hero not found");
        }

        repository.deleteById(id);
    }
}