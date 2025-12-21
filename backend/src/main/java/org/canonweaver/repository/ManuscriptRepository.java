package org.canonweaver.repository;

import java.util.Optional;

import org.canonweaver.domain.Manuscript;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManuscriptRepository extends JpaRepository<Manuscript, Long> {

    Optional<Manuscript> findByTitle(String title);
}
