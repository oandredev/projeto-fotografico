package com.sp.senac.projeto_fotografico.repositories;

import com.sp.senac.projeto_fotografico.models.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    @Query("SELECT m FROM Message m WHERE " +
            "( " +
            "    :category = 'all' OR " +
            "    (:category = 'inbox'    AND m.isArchived = false AND m.isStarred = false) OR " +
            "    (:category = 'starred'  AND m.isStarred  = true) OR " +
            "    (:category = 'archived' AND m.isArchived = true) " +
            ") " +
            "AND (:name IS NULL OR :name = '' OR LOWER(m.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "ORDER BY m.id DESC")
    Page<Message> findWithFilter(@Param("category") String category,
                                 @Param("name") String name,
                                 Pageable pageable);
}
