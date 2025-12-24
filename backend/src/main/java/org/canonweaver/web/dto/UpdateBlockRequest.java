package org.canonweaver.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateBlockRequest(
        @NotNull(message = "id is required")
        Long id,
        @NotBlank(message = "content is required")
        String content,
        @NotNull(message = "isSaved is required")
        Boolean isSaved
) {
}
