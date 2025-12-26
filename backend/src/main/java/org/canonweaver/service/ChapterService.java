package org.canonweaver.service;

import org.canonweaver.domain.Chapter;
import org.canonweaver.repository.ChapterRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ChapterService {

    private final ChapterRepository chapterRepository;

    public ChapterService(ChapterRepository chapterRepository) {
        this.chapterRepository = chapterRepository;
    }

    public List<Chapter> findAll() {
        return chapterRepository.findAll();
    }

    public Chapter create(Chapter chapter) {
        int attempts = 0;
        while (true) {
            Integer maxSortOrder = chapterRepository.findMaxSortOrder();
            int nextSortOrder = (maxSortOrder == null) ? 1 : maxSortOrder + 1;
            chapter.setSortOrder(nextSortOrder);
            try {
                return chapterRepository.save(chapter);
            } catch (DuplicateKeyException ex) {
                attempts += 1;
                if (attempts >= 3) {
                    throw ex;
                }
            }
        }
    }

    public Chapter updateName(Long id, String name) {
        Chapter existing = chapterRepository.findById(id);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chapter not found");
        }
        existing.setName(name);
        return chapterRepository.save(existing);
    }
}
