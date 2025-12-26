package org.canonweaver.web.dto;

public record BlockResponse(Long id, String content, boolean isLocked, Long sceneId) {
}
