package org.canonweaver.web.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.canonweaver.domain.Manuscript;
import org.canonweaver.service.ManuscriptService;
import org.canonweaver.web.dao.ManuscriptDao;
import org.canonweaver.web.dto.ManuscriptRequest;
import org.canonweaver.web.dto.ManuscriptResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manuscripts")
public class ManuscriptController {

    private final ManuscriptService manuscriptService;
    private final ManuscriptDao manuscriptDao;

    public ManuscriptController(ManuscriptService manuscriptService, ManuscriptDao manuscriptDao) {
        this.manuscriptService = manuscriptService;
        this.manuscriptDao = manuscriptDao;
    }

    @GetMapping
    public List<ManuscriptResponse> listManuscripts() {
        return manuscriptDao.toResponses(manuscriptService.findAll());
    }

    @GetMapping("/{id}")
    public ManuscriptResponse getById(@PathVariable Long id) {
        return manuscriptDao.toResponse(manuscriptService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ManuscriptResponse> create(@Valid @RequestBody ManuscriptRequest request) {
        Manuscript created = manuscriptService.create(manuscriptDao.toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(manuscriptDao.toResponse(created));
    }
}
