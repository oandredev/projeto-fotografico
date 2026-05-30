package sp.senac.projeto_fotografico.repositories;

import sp.senac.projeto_fotografico.models.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    
    @Query("SELECT m FROM Message m WHERE " +
           "(:category = 'inbox' AND m.isArchived = false) OR " +
           "(:category = 'starred' AND m.isStarred = true) OR " +
           "(:category = 'archived' AND m.isArchived = true) " +
           "AND (:name IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "ORDER BY m.id DESC")
    Page<Message> findMessagesWithFilter(@Param("category") String category, 
                                         @Param("name") String name, 
                                         Pageable pageable);
    
    
    long count();
}