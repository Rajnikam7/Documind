package com.raj.documind.service;

import com.raj.documind.entity.Document;
import com.raj.documind.repository.DocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DocumentService {

    private static final Logger log = LoggerFactory.getLogger(DocumentService.class);
    private static final String UPLOAD_DIR = "uploads/";

    // AI service URLs — Python on 8000, Node on 8001
    private static final String PYTHON_AI_URL = "http://localhost:8000";
    private static final String NODE_AI_URL = "http://localhost:8001";

    private final DocumentRepository documentRepository;
    private final RestTemplate restTemplate;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
        this.restTemplate = new RestTemplate();
    }

    // Upload and route to Python AI service (default)
    public Document uploadDocument(MultipartFile file) throws IOException {
        return uploadAndProcess(file, "python");
    }

    // Upload and route to a specific AI service: "python" or "node"
    public Document uploadAndProcess(MultipartFile file, String aiService) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        Document doc = new Document();
        doc.setFileName(fileName);
        doc.setFileType(file.getContentType());
        doc.setFilePath(filePath.toString());
        doc.setUploadedAt(LocalDateTime.now());
        Document saved = documentRepository.save(doc);

        // Route to selected AI service
        String serviceUrl = "node".equalsIgnoreCase(aiService) ? NODE_AI_URL : PYTHON_AI_URL;

        try {
            Map<String, String> payload = new HashMap<>();
            payload.put("file_path", filePath.toAbsolutePath().toString());
            payload.put("document_id", saved.getId().toString());
            restTemplate.postForObject(serviceUrl + "/process-document", payload, String.class);
            log.info("[{}] Processed doc_id={}", aiService.toUpperCase(), saved.getId());
        } catch (RestClientException e) {
            log.error("[{}] Call failed: {}", aiService.toUpperCase(), e.getMessage());
        }

        return saved;
    }

    public List<Document> getAll() {
        return documentRepository.findAll();
    }

    // Ask question — route to correct AI service based on which processed the doc
    public Map<String, Object> askQuestion(Integer docId, String question, String aiService) {
        String serviceUrl = "node".equalsIgnoreCase(aiService) ? NODE_AI_URL : PYTHON_AI_URL;

        Map<String, String> payload = new HashMap<>();
        payload.put("question", question);
        payload.put("document_id", docId.toString());

        Map response = restTemplate.postForObject(serviceUrl + "/ask", payload, Map.class);

        return Map.of(
            "documentId", docId,
            "question", question,
            "answer", response.get("answer"),
            "service", aiService
        );
    }

    // Overload — default to python for backwards compatibility
    public Map<String, Object> askQuestion(Integer docId, String question) {
        return askQuestion(docId, question, "python");
    }
}
