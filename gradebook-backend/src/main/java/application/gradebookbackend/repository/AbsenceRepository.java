package application.gradebookbackend.repository;

import application.gradebookbackend.domain.Absence;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface AbsenceRepository extends JpaRepository<Absence, UUID> {
    List<Absence> findByStudentIdOrderByDateDesc(UUID studentId);

    @Query("SELECT a FROM Absence a JOIN FETCH a.student s JOIN FETCH s.user ORDER BY a.createdAt DESC")
    List<Absence> findRecentAbsencesWithStudent(Pageable pageable);

    @Query("SELECT a FROM Absence a JOIN FETCH a.student s JOIN FETCH s.user WHERE a.createdBy.id = :userId ORDER BY a.createdAt DESC")
    List<Absence> findByCreatedByIdOrderByCreatedAtDesc(@Param("userId") UUID userId);

    boolean existsByCreatedById(UUID userId);

    long countByCreatedById(UUID userId);
}
