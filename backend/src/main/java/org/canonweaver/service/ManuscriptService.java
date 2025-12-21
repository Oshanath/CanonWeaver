package org.canonweaver.service;

import java.util.List;

import org.canonweaver.domain.Manuscript;
import org.canonweaver.exception.NotFoundException;
import org.canonweaver.repository.ManuscriptRepository;
import org.springframework.stereotype.Service;

@Service
public class ManuscriptService {

    private final ManuscriptRepository manuscriptRepository;

    public ManuscriptService(ManuscriptRepository manuscriptRepository) {
        this.manuscriptRepository = manuscriptRepository;
    }

    public List<Manuscript> findAll() {
        return manuscriptRepository.findAll();
    }

    public Manuscript findById(Long id) {
        return manuscriptRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Manuscript not found: " + id));
    }

    public Manuscript create(Manuscript manuscript) {
        return manuscriptRepository.save(manuscript);
    }
}
