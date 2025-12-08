package org.canonweaver.web.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.canonweaver.domain.Person;
import org.canonweaver.service.PersonService;
import org.canonweaver.web.dao.PersonDao;
import org.canonweaver.web.dto.PersonRequest;
import org.canonweaver.web.dto.PersonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/people")
public class PersonController {

    private final PersonService personService;
    private final PersonDao personDao;

    public PersonController(PersonService personService, PersonDao personDao) {
        this.personService = personService;
        this.personDao = personDao;
    }

    @GetMapping
    public List<PersonResponse> listPeople() {
        return personDao.toResponses(personService.findAll());
    }

    @GetMapping("/{id}")
    public PersonResponse getById(@PathVariable String id) {
        return personDao.toResponse(personService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PersonResponse> create(@Valid @RequestBody PersonRequest request) {
        Person created = personService.create(personDao.toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(personDao.toResponse(created));
    }
}
