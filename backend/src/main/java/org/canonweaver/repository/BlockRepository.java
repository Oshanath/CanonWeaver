package org.canonweaver.repository;

import org.canonweaver.domain.Block;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.nio.charset.StandardCharsets;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class BlockRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Block> rowMapper = ((rs, rowNum) -> new Block(
            rs.getLong("id"),
            rs.getString("content"),
            rs.getBoolean("is_locked"),
            rs.getLong("scene_id")
    ));

    public BlockRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Block save(Block block) {
        if (block.getContent() == null) {
            block.setContent("");
        }
        if (block.getId() == null) {
            return insert(block);
        }
        update(block);
        return block;
    }

    private Block insert(Block block) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    INSERT INTO blocks (content, is_locked, scene_id) VALUES (?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, block.getContent());
            ps.setBoolean(2, block.isLocked());
            ps.setLong(3, block.getSceneId());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            block.setId(key.longValue());
        }
        return block;
    }

    private void update(Block block) {
        jdbcTemplate.update("""
                UPDATE blocks
                SET content = ?,
                    is_locked = ?,
                    scene_id = ?
                WHERE id = ?
                """,
                block.getContent(),
                block.isLocked(),
                block.getSceneId(),
                block.getId());
    }

    public List<Block> findAll() {
        return jdbcTemplate.query("""
                SELECT id, content, is_locked, scene_id
                FROM blocks
                """, rowMapper);
    }

    public List<Block> findAllBySceneId(Long sceneId) {
        return jdbcTemplate.query("""
                SELECT id, content, is_locked, scene_id
                FROM blocks
                WHERE scene_id = ?
                """, rowMapper, sceneId);
    }

    public void deleteById(Long id) {
        jdbcTemplate.update("""
                DELETE FROM blocks
                WHERE id = ?
                """, id);
    }

}
