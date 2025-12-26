package org.canonweaver.web.controller;

import jakarta.validation.Valid;
import org.canonweaver.domain.Chapter;
import org.canonweaver.service.ChapterService;
import org.canonweaver.web.dao.ChapterDao;
import org.canonweaver.web.dto.ChapterResponse;
import org.canonweaver.web.dto.CreateChapterRequest;
import org.canonweaver.web.dto.UpdateChapterRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {

    private final ChapterService chapterService;
    private final ChapterDao chapterDao;

    public ChapterController(ChapterService chapterService, ChapterDao chapterDao) {
        this.chapterService = chapterService;
        this.chapterDao = chapterDao;
    }

    @GetMapping
    public List<ChapterResponse> listChapters() {
        return chapterDao.toResponses(chapterService.findAll());
    }

    @PostMapping
    public ResponseEntity<ChapterResponse> create(@Valid @RequestBody CreateChapterRequest request) {
        Chapter created = chapterService.create(chapterDao.toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(chapterDao.toResponse(created));
    }

    @PutMapping("/{id}")
    public ChapterResponse updateName(@PathVariable Long id, @Valid @RequestBody UpdateChapterRequest request) {
        Chapter updated = chapterService.updateName(id, request.name());
        return chapterDao.toResponse(updated);
    }
}
