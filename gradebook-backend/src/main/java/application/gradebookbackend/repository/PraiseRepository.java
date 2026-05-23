package application.gradebookbackend.repository;

import application.gradebookbackend.domain.Praise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PraiseRepository extends JpaRepository<Praise, UUID> {

    List<Praise> findByStudentIdOrderByDateDesc(UUID studentId);
}
