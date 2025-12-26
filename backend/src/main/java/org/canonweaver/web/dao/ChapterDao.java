package org.canonweaver.web.dao;

import org.canonweaver.domain.Chapter;
import org.canonweaver.web.dto.ChapterResponse;
import org.canonweaver.web.dto.CreateChapterRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ChapterDao {

    public Chapter toEntity(CreateChapterRequest request) {
        return new Chapter(null, request.name(), null);
    }

    public ChapterResponse toResponse(Chapter chapter) {
        return new ChapterResponse(chapter.getId(), chapter.getName(), chapter.getSortOrder());
    }

    public List<ChapterResponse> toResponses(List<Chapter> chapters) {
        return chapters.stream().map(this::toResponse).toList();
    }
}
