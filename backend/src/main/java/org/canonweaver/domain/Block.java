package org.canonweaver.domain;

public class Block {

    private Long id;
    private String content;
    private boolean isSaved;

    public Block() {

    }

    public Block(Long id, String content, boolean isSaved) {
        this.id = id;
        this.content = content;
        this.isSaved = isSaved;
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

    public boolean isSaved() {
        return isSaved;
    }

    public void setSaved(boolean saved) {
        isSaved = saved;
    }
}
