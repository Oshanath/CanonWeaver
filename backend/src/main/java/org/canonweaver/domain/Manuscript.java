package org.canonweaver.domain;

public class Manuscript {

    private Long id;
    private String title;
    private String author;
    private Integer yearWritten;

    public Manuscript() {
        // Default constructor
    }

    public Manuscript(Long id, String title, String author, Integer yearWritten) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.yearWritten = yearWritten;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Integer getYearWritten() {
        return yearWritten;
    }

    public void setYearWritten(Integer yearWritten) {
        this.yearWritten = yearWritten;
    }
}
