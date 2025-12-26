package org.canonweaver.repository;

import org.canonweaver.domain.Chapter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class ChapterRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Chapter> rowMapper = (rs, rowNum) -> new Chapter(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getObject("sort_order", Integer.class)
    );

    public ChapterRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Chapter> findAll() {
        return jdbcTemplate.query("""
                SELECT id, name, sort_order
                FROM chapters
                ORDER BY sort_order
                """, rowMapper);
    }

    public Chapter findById(Long id) {
        List<Chapter> results = jdbcTemplate.query("""
                SELECT id, name, sort_order
                FROM chapters
                WHERE id = ?
                """, rowMapper, id);
        return results.stream().findFirst().orElse(null);
    }

    public Integer findMaxSortOrder() {
        return jdbcTemplate.queryForObject("""
                SELECT MAX(sort_order)
                FROM chapters
                """, Integer.class);
    }

    public Chapter save(Chapter chapter) {
        if (chapter.getId() == null) {
            return insert(chapter);
        }
        update(chapter);
        return chapter;
    }

    private Chapter insert(Chapter chapter) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement("""
                    INSERT INTO chapters (name, sort_order)
                    VALUES (?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, chapter.getName());
            ps.setObject(2, chapter.getSortOrder());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            chapter.setId(key.longValue());
        }
        return chapter;
    }

    private void update(Chapter chapter) {
        jdbcTemplate.update("""
                UPDATE chapters
                SET name = ?, sort_order = ?
                WHERE id = ?
                """,
                chapter.getName(),
                chapter.getSortOrder(),
                chapter.getId()
        );
    }
}
