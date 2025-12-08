package org.canonweaver.repository;

import java.util.Optional;

import org.canonweaver.domain.Person;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface PersonRepository extends Neo4jRepository<Person, String> {

    Optional<Person> findByName(String name);
}
