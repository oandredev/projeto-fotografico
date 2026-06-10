package com.sp.senac.projeto_fotografico.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sp.senac.projeto_fotografico.dto.CategoryStatsResponse;
import com.sp.senac.projeto_fotografico.dto.PortfolioResponse;
import com.sp.senac.projeto_fotografico.dto.PortfolioStatsResponse;
import com.sp.senac.projeto_fotografico.models.Portfolio;
import com.sp.senac.projeto_fotografico.repositories.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository repository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${upload.root:uploads}")
    private String uploadRoot;

    @Value("${portfolio.base-url:http://localhost:3010}")
    private String baseUrl;

    public List<PortfolioResponse> getPortfolios() {
        return repository.findAll()
                .stream()
                .sorted(Comparator.comparing(p -> p.getCategory().getOrderIndex()))
                .map(p -> new PortfolioResponse(
                        p.getId(),
                        p.getCategory().getId(),
                        p.getCategory().getName(),
                        p.getCategory().getOrderIndex(),
                        p.getImageUrls(),
                        p.getLastUpdate()
                ))
                .toList();
    }

    public PortfolioResponse getPortfolioById(int id) {
        Portfolio p = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));

        return new PortfolioResponse(
                p.getId(),
                p.getCategory().getId(),
                p.getCategory().getName(),
                p.getCategory().getOrderIndex(),
                p.getImageUrls(),
                p.getLastUpdate()
        );
    }

    public List<Portfolio> getPortfoliosByCategory(int categoryId) {
        return repository.findByCategory_Id(categoryId);
    }

    public void deletePortfolio(int id) {
        Portfolio portfolio = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
        repository.delete(portfolio);
    }

    public PortfolioStatsResponse getStats() {
        List<Portfolio> portfolios = repository.findAll();

        long categoriasAtivas = portfolios.size();

        long fotosArmazenadas = portfolios.stream()
                .mapToLong(p -> p.getImageUrls() == null ? 0 : p.getImageUrls().size())
                .sum();

        List<CategoryStatsResponse> categorias = portfolios.stream()
                .map(p -> new CategoryStatsResponse(
                        p.getCategory().getId(),
                        p.getImageUrls() == null ? 0 : p.getImageUrls().size(),
                        p.getCategory().getViews()
                ))
                .toList();

        long visualizacoes = categorias.stream()
                .mapToLong(CategoryStatsResponse::getViews)
                .sum();

        return new PortfolioStatsResponse(categoriasAtivas, fotosArmazenadas, visualizacoes, categorias);
    }

    public Portfolio save(Portfolio portfolio) {
        return repository.save(portfolio);
    }

    public PortfolioResponse update(Integer id, MultipartHttpServletRequest request) throws IOException {

        Portfolio portfolio = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));

        Path uploadPath = Paths.get(System.getProperty("user.dir"), uploadRoot).normalize().resolve("portfolio");
        Files.createDirectories(uploadPath);

        List<String> imageUrls;
        String existingImagesParam = request.getParameter("existingImages");

        if (existingImagesParam != null && !existingImagesParam.isBlank()) {
            try {
                imageUrls = new ArrayList<>(
                        objectMapper.readValue(existingImagesParam, new TypeReference<List<String>>() {})
                );
            } catch (Exception e) {
                imageUrls = portfolio.getImageUrls() != null
                        ? new ArrayList<>(portfolio.getImageUrls())
                        : new ArrayList<>();
            }
        } else {
            imageUrls = portfolio.getImageUrls() != null
                    ? new ArrayList<>(portfolio.getImageUrls())
                    : new ArrayList<>();
        }

        List<String> urlsAntigas = portfolio.getImageUrls() != null
                ? portfolio.getImageUrls()
                : new ArrayList<>();

        for (String urlAntiga : urlsAntigas) {
            if (!imageUrls.contains(urlAntiga)) {
                // Extrai o nome do arquivo da URL: "/uploads/portfolio/arquivo.png" -> "arquivo.png"
                String nomeArquivo = urlAntiga.substring(urlAntiga.lastIndexOf("/") + 1);
                Path arquivoFisico = uploadPath.resolve(nomeArquivo);
                try {
                    Files.deleteIfExists(arquivoFisico);
                } catch (Exception e) {
                    System.out.println("Aviso: nao foi possivel deletar arquivo: " + arquivoFisico);
                }
            }
        }

        Iterator<String> fileNames = request.getFileNames();
        while (fileNames.hasNext()) {
            String paramName = fileNames.next();

            if (paramName.equals("category_id") || paramName.equals("existingImages")) continue;

            MultipartFile file = request.getFile(paramName);
            if (file == null || file.isEmpty()) continue;

            String original = file.getOriginalFilename();
            String extension = (original != null && original.contains("."))
                    ? original.substring(original.lastIndexOf("."))
                    : ".jpg";
            String fileName = UUID.randomUUID() + extension;

            file.transferTo(uploadPath.resolve(fileName).toFile());

            String publicUrl = "/uploads/portfolio/" + fileName;
            imageUrls.add(publicUrl);
        }

        portfolio.setImageUrls(imageUrls);
        Portfolio saved = repository.save(portfolio);

        return new PortfolioResponse(
                saved.getId(),
                saved.getCategory().getId(),
                saved.getCategory().getName(),
                saved.getCategory().getOrderIndex(),
                saved.getImageUrls(),
                saved.getLastUpdate()
        );
    }
}