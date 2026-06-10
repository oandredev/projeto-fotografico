package com.sp.senac.projeto_fotografico.controllers;

import com.sp.senac.projeto_fotografico.models.About;
import com.sp.senac.projeto_fotografico.services.AboutService;
import com.sp.senac.projeto_fotografico.util.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/about")
public class AboutController {

    @Autowired
    private AboutService service;

    @Autowired
    private FileStorageService fileStorage;

    @GetMapping
    public ResponseEntity<?> getAbout() {
        return ResponseEntity.ok(service.getAbout().orElse(null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAboutById(@PathVariable int id) {
        return service.getAboutById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body(Map.of("error", "About not found")));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable int id,
            @RequestParam("presentationText") String presentationText,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            About existing = service.getAboutById(id)
                    .orElse(null);

            if (existing == null) {
                return ResponseEntity.status(404).body(Map.of("error", "About not found"));
            }

            String imageUrl = existing.getImageUrl();

            if (image != null && !image.isEmpty()) {
                // Apaga a imagem antiga antes de salvar a nova — igual ao deleteFile() do Node
                if (existing.getImageUrl() != null) {
                    fileStorage.delete(existing.getImageUrl());
                }
                imageUrl = fileStorage.save(image, "about");
            }

            service.update(id, presentationText, imageUrl);
            return ResponseEntity.ok(Map.of("result", "Change saved successfully!"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();          // 204
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}
