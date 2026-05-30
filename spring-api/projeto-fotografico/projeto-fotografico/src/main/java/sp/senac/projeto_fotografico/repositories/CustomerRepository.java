package sp.senac.projeto_fotografico.repositories;

import sp.senac.projeto_fotografico.models.Customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer>{
    
    @Query("SELECT c FROM Customer c WHERE " +
           "(:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:isStarred IS NULL OR c.isStarred = :isStarred) AND " +
           "(:isArchived IS NULL OR c.isArchived = :isArchived) " +
           "ORDER BY c.id DESC")
    Page<Customer> findCustomersWithFilters(@Param("name") String name,
                                            @Param("isStarred") Boolean isStarred,
                                            @Param("isArchived") Boolean isArchived,
                                            Pageable pageable);
    
    List<Customer> findByIsStarredTrue();
    List<Customer> findByIsArchivedTrue();
    
    List<Customer> findByNameContainingIgnoreCase(String name);
    
    long count();
}
