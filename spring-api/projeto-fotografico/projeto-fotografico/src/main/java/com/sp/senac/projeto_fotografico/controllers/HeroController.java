package com.sp.senac.projeto_fotografico.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sp.senac.projeto_fotografico.models.Hero;
import com.sp.senac.projeto_fotografico.services.HeroService;
import com.sp.senac.projeto_fotografico.util.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/hero")
public class HeroController {

    private static final int HERO_MAX_IMAGES = 16;

    @Autowired
    private HeroService service;

    @Autowired
    private FileStorageService fileStorage;

    private final ObjectMapper mapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<?> getHero() {
        return ResponseEntity.ok(service.getHero().orElse(null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHeroById(@PathVariable int id) {
        return service.getHeroById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("error", "Hero not found")));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable int id,
            @RequestParam("slogan") String slogan,
            @RequestParam(value = "existingImages", required = false) String existingImagesJson,
            @RequestParam(value = "images", required = false) MultipartFile[] images
    ) {

        try {

            Hero hero = service.getHeroById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Hero not found"));

            List<String> existingImages;

            try {
                existingImages = existingImagesJson == null
                        ? new ArrayList<>()
                        : mapper.readValue(
                        existingImagesJson,
                        new TypeReference<List<String>>() {}
                );
            } catch (Exception e) {
                existingImages = new ArrayList<>();
            }

            List<String> finalImages = new ArrayList<>(existingImages);

            if (images != null) {

                int totalImages = finalImages.size() + images.length;

                if (totalImages > HERO_MAX_IMAGES) {
                    return ResponseEntity.badRequest().body(
                            Map.of(
                                    "error",
                                    "Limite de " + HERO_MAX_IMAGES + " imagens excedido"
                            )
                    );
                }

                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        String url = fileStorage.save(image, "hero");
                        finalImages.add(url);
                    }
                }
            }

            if (hero.getImageUrls() != null) {
                for (String oldImage : hero.getImageUrls()) {
                    if (!finalImages.contains(oldImage)) {
                        fileStorage.delete(oldImage);
                    }
                }
            }

            service.update(id, slogan, finalImages);

            return ResponseEntity.ok(
                    Map.of("result", "Change saved successfully!")
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {

        try {

            Hero hero = service.getHeroById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Hero not found"));

            if (hero.getImageUrls() != null) {
                for (String image : hero.getImageUrls()) {
                    fileStorage.delete(image);
                }
            }

            service.delete(id);

            return ResponseEntity.noContent().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}