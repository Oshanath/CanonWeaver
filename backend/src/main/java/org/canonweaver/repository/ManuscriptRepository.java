package org.canonweaver.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

import org.canonweaver.domain.Manuscript;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class ManuscriptRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Manuscript> rowMapper = (rs, rowNum) -> new Manuscript(
            rs.getLong("id"),
            rs.getString("title"),
            rs.getString("author"),
            rs.getObject("year_written", Integer.class)
    );

    public ManuscriptRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Manuscript> findAll() {
        return jdbcTemplate.query("""
                SELECT id, title, author, year_written
                FROM manuscripts
                ORDER BY id
                """, rowMapper);
    }

    public Optional<Manuscript> findById(Long id) {
        return jdbcTemplate.query("""
                        SELECT id, title, author, year_written
                        FROM manuscripts
                        WHERE id = ?
                        """,
                rowMapper,
                id
        ).stream().findFirst();
    }

    public Optional<Manuscript> findByTitle(String title) {
        return jdbcTemplate.query("""
                        SELECT id, title, author, year_written
                        FROM manuscripts
                        WHERE title = ?
                        """,
                rowMapper,
                title
        ).stream().findFirst();
    }

    public Manuscript save(Manuscript manuscript) {
        if (manuscript.getId() == null) {
            return insert(manuscript);
        }
        update(manuscript);
        return manuscript;
    }

    private Manuscript insert(Manuscript manuscript) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement("""
                    INSERT INTO manuscripts (title, author, year_written)
                    VALUES (?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, manuscript.getTitle());
            ps.setString(2, manuscript.getAuthor());
            ps.setObject(3, manuscript.getYearWritten());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            manuscript.setId(key.longValue());
        }
        return manuscript;
    }

    private void update(Manuscript manuscript) {
        jdbcTemplate.update("""
                UPDATE manuscripts
                SET title = ?, author = ?, year_written = ?
                WHERE id = ?
                """,
                manuscript.getTitle(),
                manuscript.getAuthor(),
                manuscript.getYearWritten(),
                manuscript.getId()
        );
    }
}
