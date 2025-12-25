package org.canonweaver.web.dto;

public record CreateBlockRequest(
        Long id,
        String content,
        Boolean isLocked
) {
}
