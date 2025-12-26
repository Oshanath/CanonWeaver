package org.canonweaver.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateBlockRequest(
        @NotNull(message = "id is required")
        Long id,
        String content,
        @NotNull(message = "isLocked is required")
        Boolean isLocked,
        @NotNull(message = "sceneId is required")
        Long sceneId
) {
}
