package com.sp.senac.projeto_fotografico.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final List<String> ALLOWED_TYPES =
            List.of("image/jpeg", "image/png", "image/webp", "image/gif");

    @Value("${upload.root:../uploads}")
    private String uploadRoot;

    public String save(MultipartFile file, String folder) throws IOException {
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Tipo de arquivo não permitido: " + file.getContentType());
        }

        Path folderPath = Paths.get(uploadRoot, folder).toAbsolutePath().normalize();
        Files.createDirectories(folderPath);

        String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String ext      = original.contains(".")
                ? original.substring(original.lastIndexOf('.'))
                : "";
        String suffix   = UUID.randomUUID().toString().replace("-", "").substring(0, 5);
        String filename = folder + "-" + System.currentTimeMillis() + "-" + suffix + ext;

        Files.copy(file.getInputStream(),
                   folderPath.resolve(filename),
                   StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + folder + "/" + filename;
    }

    public void delete(String url) {
        if (url == null || url.isBlank()) return;

        try {
            String relative = url.startsWith("/uploads/") ? url.substring("/uploads/".length()) : url;
            Path path = Paths.get(uploadRoot, relative).toAbsolutePath().normalize();
            Files.deleteIfExists(path);
        } catch (IOException ignored) {
        }
    }
}
