package org.canonweaver.service;

import java.util.List;

import org.canonweaver.domain.Person;
import org.canonweaver.exception.NotFoundException;
import org.canonweaver.repository.PersonRepository;
import org.springframework.stereotype.Service;

@Service
public class PersonService {

    private final PersonRepository personRepository;

    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public List<Person> findAll() {
        return personRepository.findAll();
    }

    public Person findById(String id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Person not found: " + id));
    }

    public Person create(Person person) {
        return personRepository.save(person);
    }
}
