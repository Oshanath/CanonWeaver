package org.canonweaver.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "manuscripts")
public class Manuscript {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 120)
    private String author;

    @Column(name = "year_written")
    private Integer yearWritten;

    public Manuscript() {
        // JPA requires a default constructor
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
