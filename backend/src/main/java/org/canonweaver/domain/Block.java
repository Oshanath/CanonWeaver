package org.canonweaver.domain;

public class Block {

    private Long id;
    private String content;
    private boolean isLocked;

    public Block() {

    }

    public Block(Long id, String content, boolean isLocked) {
        this.id = id;
        this.content = content;
        this.isLocked = isLocked;
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
}
