package org.canonweaver.web.controller;

import jakarta.validation.Valid;
import org.canonweaver.domain.Scene;
import org.canonweaver.service.SceneService;
import org.canonweaver.web.dao.SceneDao;
import org.canonweaver.web.dto.CreateSceneRequest;
import org.canonweaver.web.dto.SceneResponse;
import org.canonweaver.web.dto.UpdateSceneRequest;
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
@RequestMapping("/api/scenes")
public class SceneController {

    private final SceneService sceneService;
    private final SceneDao sceneDao;

    public SceneController(SceneService sceneService, SceneDao sceneDao) {
        this.sceneService = sceneService;
        this.sceneDao = sceneDao;
    }

    @GetMapping
    public List<SceneResponse> listScenes() {
        return sceneDao.toResponses(sceneService.findAll());
    }

    @PostMapping
    public ResponseEntity<SceneResponse> create(@Valid @RequestBody CreateSceneRequest request) {
        Scene created = sceneService.create(sceneDao.toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(sceneDao.toResponse(created));
    }

    @PutMapping("/{id}")
    public SceneResponse updateName(@PathVariable Long id, @Valid @RequestBody UpdateSceneRequest request) {
        Scene updated = sceneService.updateName(id, request.name());
        return sceneDao.toResponse(updated);
    }
}
