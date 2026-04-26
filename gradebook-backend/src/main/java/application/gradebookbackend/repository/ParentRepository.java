package application.gradebookbackend.repository;

import application.gradebookbackend.domain.Parent;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ParentRepository extends JpaRepository<Parent, UUID> {

    @EntityGraph(attributePaths = {"user"})
    List<Parent> findAll();
}
