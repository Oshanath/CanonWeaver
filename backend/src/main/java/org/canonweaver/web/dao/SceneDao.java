package org.canonweaver.web.dao;

import org.canonweaver.domain.Scene;
import org.canonweaver.web.dto.CreateSceneRequest;
import org.canonweaver.web.dto.SceneResponse;
import org.canonweaver.web.dto.UpdateSceneRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SceneDao {

    public Scene toEntity(CreateSceneRequest request) {
        return new Scene(null, request.name(), null, request.chapterId());
    }

    public Scene toEntity(UpdateSceneRequest request) {
        return new Scene(null, request.name(), null, null);
    }

    public SceneResponse toResponse(Scene scene) {
        return new SceneResponse(scene.getId(), scene.getName(), scene.getSortOrder(), scene.getChapterId());
    }

    public List<SceneResponse> toResponses(List<Scene> scenes) {
        return scenes.stream().map(this::toResponse).toList();
    }
}
