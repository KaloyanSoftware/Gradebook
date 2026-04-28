package application.gradebookbackend.repository;

import application.gradebookbackend.domain.Absence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AbsenceRepository extends JpaRepository<Absence, UUID> {
    List<Absence> findByStudentIdOrderByDateDesc(UUID studentId);
}
