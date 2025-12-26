package org.canonweaver.domain;

public class Block {

    private Long id;
    private String content;
    private boolean isLocked;
    private Long sceneId;

    public Block() {

    }

    public Block(Long id, String content, boolean isLocked, Long sceneId) {
        this.id = id;
        this.content = content;
        this.isLocked = isLocked;
        this.sceneId = sceneId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void setLocked(boolean locked) {
        isLocked = locked;
    }

    public Long getSceneId() {
        return sceneId;
    }

    public void setSceneId(Long sceneId) {
        this.sceneId = sceneId;
    }
}
