package org.canonweaver.web.dao;

import java.util.List;

import org.canonweaver.domain.Manuscript;
import org.canonweaver.web.dto.ManuscriptRequest;
import org.canonweaver.web.dto.ManuscriptResponse;
import org.springframework.stereotype.Component;

@Component
public class ManuscriptDao {

    public Manuscript toEntity(ManuscriptRequest request) {
        return new Manuscript(null, request.title(), request.author(), request.yearWritten());
    }

    public ManuscriptResponse toResponse(Manuscript manuscript) {
        return new ManuscriptResponse(
                manuscript.getId(),
                manuscript.getTitle(),
                manuscript.getAuthor(),
                manuscript.getYearWritten()
        );
    }

    public List<ManuscriptResponse> toResponses(List<Manuscript> manuscripts) {
        return manuscripts.stream().map(this::toResponse).toList();
    }
}
