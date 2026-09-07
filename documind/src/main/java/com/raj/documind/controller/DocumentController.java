package com.raj.documind.controller;

import com.raj.documind.dto.AskRequest;
import com.raj.documind.entity.Document;
import com.raj.documind.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    // POST /documents/upload — upload via Python AI (default)
    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(@RequestParam("file") MultipartFile file) throws IOException {
        Document saved = documentService.uploadAndProcess(file, "python");
        return ResponseEntity.ok(saved);
    }

    // POST /documents/upload/node — upload via Node AI
    @PostMapping("/upload/node")
    public ResponseEntity<Document> uploadDocumentNode(@RequestParam("file") MultipartFile file) throws IOException {
        Document saved = documentService.uploadAndProcess(file, "node");
        return ResponseEntity.ok(saved);
    }

    // GET /documents — list all documents
    @GetMapping
    public List<Document> getDocuments() {
        return documentService.getAll();
    }

    // POST /documents/{id}/ask — ask via Python AI (default)
    @PostMapping("/{id}/ask")
    public Map<String, Object> askQuestion(@PathVariable Integer id, @RequestBody AskRequest request) {
        return documentService.askQuestion(id, request.getQuestion(), "python");
    }

    // POST /documents/{id}/ask/node — ask via Node AI
    @PostMapping("/{id}/ask/node")
    public Map<String, Object> askQuestionNode(@PathVariable Integer id, @RequestBody AskRequest request) {
        return documentService.askQuestion(id, request.getQuestion(), "node");
    }
}
