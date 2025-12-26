package org.canonweaver.repository;

import org.canonweaver.domain.Scene;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class SceneRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Scene> rowMapper = (rs, rowNum) -> new Scene(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getObject("sort_order", Integer.class),
            rs.getLong("chapter_id")
    );

    public SceneRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Scene> findAll() {
        return jdbcTemplate.query("""
                SELECT id, name, sort_order, chapter_id
                FROM scenes
                ORDER BY chapter_id, sort_order
                """, rowMapper);
    }

    public Scene findById(Long id) {
        List<Scene> results = jdbcTemplate.query("""
                SELECT id, name, sort_order, chapter_id
                FROM scenes
                WHERE id = ?
                """, rowMapper, id);
        return results.stream().findFirst().orElse(null);
    }

    public Integer findMaxSortOrder(Long chapterId) {
        return jdbcTemplate.queryForObject("""
                SELECT MAX(sort_order)
                FROM scenes
                WHERE chapter_id = ?
                """, Integer.class, chapterId);
    }

    public Scene save(Scene scene) {
        if (scene.getId() == null) {
            return insert(scene);
        }
        update(scene);
        return scene;
    }

    private Scene insert(Scene scene) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement("""
                    INSERT INTO scenes (name, sort_order, chapter_id)
                    VALUES (?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, scene.getName());
            ps.setObject(2, scene.getSortOrder());
            ps.setObject(3, scene.getChapterId());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            scene.setId(key.longValue());
        }
        return scene;
    }

    private void update(Scene scene) {
        jdbcTemplate.update("""
                UPDATE scenes
                SET name = ?, sort_order = ?, chapter_id = ?
                WHERE id = ?
                """,
                scene.getName(),
                scene.getSortOrder(),
                scene.getChapterId(),
                scene.getId()
        );
    }
}
