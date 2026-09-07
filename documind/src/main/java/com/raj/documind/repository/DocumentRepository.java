package com.raj.documind.repository;

import com.raj.documind.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for Document database operations.
 *
 * By extending JpaRepository, Spring automatically provides common DB methods:
 *   - save(doc)       → INSERT or UPDATE a document
 *   - findAll()       → SELECT * FROM documents
 *   - findById(id)    → SELECT * WHERE id = ?
 *   - deleteById(id)  → DELETE WHERE id = ?
 *
 * You don't need to write any SQL — Spring Data JPA handles it all.
 * The two generic types are: <EntityClass, PrimaryKeyType>
 */
public interface DocumentRepository extends JpaRepository<Document, Integer> {
    // You can add custom query methods here later, e.g.:
    // List<Document> findByFileType(String fileType);
}
