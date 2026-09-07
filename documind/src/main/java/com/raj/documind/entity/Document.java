package com.raj.documind.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity class representing a document stored in the system.
 * This maps to the "documents" table in the database.
 * Think of this like a model/schema — each field is a column in the table.
 */
@Entity
@Table(name = "documents")
public class Document {

    // Auto-incremented primary key — like an ID field in any DB table
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Original name of the uploaded file (e.g., "resume.pdf")
    private String fileName;

    // MIME type or extension of the file (e.g., "application/pdf" or "pdf")
    private String fileType;

    // Path on disk or storage where the file is saved
    private String filePath;

    // Timestamp of when the document was uploaded
    private LocalDateTime uploadedAt;

    // --- Getters & Setters ---
    // These allow other classes to read/write the private fields above

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
