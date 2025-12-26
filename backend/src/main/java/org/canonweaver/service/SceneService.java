package org.canonweaver.service;

import org.canonweaver.domain.Chapter;
import org.canonweaver.domain.Scene;
import org.canonweaver.repository.ChapterRepository;
import org.canonweaver.repository.SceneRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SceneService {

    private final SceneRepository sceneRepository;
    private final ChapterRepository chapterRepository;

    public SceneService(SceneRepository sceneRepository, ChapterRepository chapterRepository) {
        this.sceneRepository = sceneRepository;
        this.chapterRepository = chapterRepository;
    }

    public List<Scene> findAll() {
        return sceneRepository.findAll();
    }

    public Scene create(Scene scene) {
        Chapter chapter = chapterRepository.findById(scene.getChapterId());
        if (chapter == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chapter not found");
        }
        Integer maxSortOrder = sceneRepository.findMaxSortOrder(scene.getChapterId());
        int nextSortOrder = (maxSortOrder == null) ? 1 : maxSortOrder + 1;
        scene.setSortOrder(nextSortOrder);
        return sceneRepository.save(scene);
    }

    public Scene updateName(Long id, String name) {
        Scene existing = sceneRepository.findById(id);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Scene not found");
        }
        existing.setName(name);
        return sceneRepository.save(existing);
    }
}
