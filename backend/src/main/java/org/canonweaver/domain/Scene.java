package org.canonweaver.domain;

public class Scene {

    private Long id;
    private String name;
    private Integer sortOrder;
    private Long chapterId;

    public Scene() {
        // Default constructor
    }

    public Scene(Long id, String name, Integer sortOrder, Long chapterId) {
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.chapterId = chapterId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Long getChapterId() {
        return chapterId;
    }

    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
    }
}
