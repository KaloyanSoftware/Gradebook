package application.gradebookbackend.repository;

import application.gradebookbackend.domain.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ParentRepository extends JpaRepository<Parent, UUID> {
}
