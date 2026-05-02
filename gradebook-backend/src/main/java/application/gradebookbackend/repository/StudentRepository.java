package application.gradebookbackend.repository;

import application.gradebookbackend.domain.Student;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {

    @EntityGraph(attributePaths = {"user"})
    List<Student> findAll();

    Optional<Student> findByUserId(UUID userId);
}
