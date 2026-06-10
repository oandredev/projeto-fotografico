package com.sp.senac.projeto_fotografico.services;

import com.sp.senac.projeto_fotografico.dto.MessageStatsResponse;
import com.sp.senac.projeto_fotografico.models.Message;
import com.sp.senac.projeto_fotografico.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository repository;

    public Message salvar(Message mensagem) {
        return repository.save(mensagem);
    }

    public Optional<Message> buscar(int id) {
        return repository.findById(id);
    }

    public Message atualizar(Integer id, Message mensagem) {
        mensagem.setId(id);
        return repository.save(mensagem);
    }

    public void deletar(int id) {
        repository.deleteById(id);
    }

    public Map<String, Object> buscarComFiltro(String category, String name, int page) {
        String cat  = (category == null || category.isBlank()) ? "all" : category;
        String nm   = (name     == null)                       ? ""    : name;

        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by("id").descending());
        Page<Message> result = repository.findWithFilter(cat, nm, pageable);

        Map<String, Object> pagination = Map.of(
                "total",           result.getTotalElements(),
                "itemsPerPage",    result.getSize(),
                "currentPage",     page,
                "totalPages",      result.getTotalPages(),
                "hasNextPage",     result.hasNext(),
                "hasPreviousPage", result.hasPrevious()
        );

        return Map.of(
                "messages",   result.getContent(),
                "pagination", pagination
        );
    }

    public MessageStatsResponse getStats() {
        LocalDateTime now = LocalDateTime.now();

        long total     = repository.countBy();
        long ativas    = repository.countByIsStarredFalseAndIsArchivedFalse();
        long favoritas = repository.countByIsStarredTrue();
        long arquivadas = repository.countByIsArchivedTrue();

        long day   = repository.countByDateAfter(now.minusDays(1));
        long week  = repository.countByDateAfter(now.minusDays(7));
        long month = repository.countByDateAfter(now.minusDays(30));
        long year  = repository.countByDateAfter(now.minusDays(365));

        return new MessageStatsResponse(
                total, favoritas, arquivadas, ativas,
                day, week, month, year
        );
    }
}
