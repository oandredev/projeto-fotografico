package com.sp.senac.projeto_fotografico.services;

import com.sp.senac.projeto_fotografico.models.About;
import com.sp.senac.projeto_fotografico.repositories.AboutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AboutService {

    @Autowired
    private AboutRepository repository;

    public Optional<About> getAbout() {
        return repository.findAll().stream().findFirst();
    }

    public Optional<About> getAboutById(int id) {
        return repository.findById(id);
    }

    public About update(int id, String presentationText, String imageUrl) {
        if (presentationText == null || presentationText.isBlank()) {
            throw new IllegalArgumentException("Presentation text is required");
        }

        About about = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("About not found"));

        about.setPresentationText(presentationText);
        about.setImageUrl(imageUrl);

        return repository.save(about);
    }

    public void delete(int id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("About not found");
        }
        repository.deleteById(id);
    }
}
