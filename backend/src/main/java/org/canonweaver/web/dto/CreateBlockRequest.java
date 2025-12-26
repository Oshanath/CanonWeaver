package org.canonweaver.web.dto;

import jakarta.validation.constraints.NotNull;

public record CreateBlockRequest(
        Long id,
        String content,
        Boolean isLocked,
        @NotNull(message = "sceneId is required")
        Long sceneId
) {
}
