package com.sp.senac.projeto_fotografico.repositories;

import com.sp.senac.projeto_fotografico.models.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query("SELECT c FROM Customer c WHERE " +
            "( " +
            "    :category = 'all' OR " +
            "    (:category = 'inbox'    AND c.isArchived = false AND c.isStarred = false) OR " +
            "    (:category = 'starred'  AND c.isStarred  = true) OR " +
            "    (:category = 'archived' AND c.isArchived = true) " +
            ") " +
            "AND (:name IS NULL OR :name = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "ORDER BY c.id DESC")
    Page<Customer> findWithFilter(@Param("category") String category,
                                  @Param("name") String name,
                                  Pageable pageable);

    long countBy();
    long countByIsStarredFalseAndIsArchivedFalse();
    long countByIsStarredTrue();
    long countByIsArchivedTrue();

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.register >= :from")
    long countByRegisterAfter(@Param("from") java.time.LocalDateTime from);
}