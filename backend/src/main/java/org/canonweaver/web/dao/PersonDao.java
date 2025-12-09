package org.canonweaver.web.dao;

import java.util.List;

import org.canonweaver.domain.Person;
import org.canonweaver.web.dto.PersonRequest;
import org.canonweaver.web.dto.PersonResponse;
import org.springframework.stereotype.Component;

@Component
public class PersonDao {

    /**
     * Centralizes mapping between inbound requests, domain entities, and API responses.
     */
    public Person toEntity(PersonRequest request) {
        return new Person(null, request.name(), request.birthYear());
    }

    public PersonResponse toResponse(Person person) {
        return new PersonResponse(person.getId(), person.getName(), person.getBirthYear());
    }

    public List<PersonResponse> toResponses(List<Person> people) {
        return people.stream().map(this::toResponse).toList();
    }
}
