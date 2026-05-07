package application.gradebookbackend.repository;

import application.gradebookbackend.domain.Grade;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GradeRepository extends JpaRepository<Grade, UUID> {

    @Query("SELECT g.id, g.subject, g.value, g.date, g.createdAt, s.id, s.user.firstName, s.user.lastName " +
           "FROM Student s JOIN s.grades g ORDER BY g.createdAt DESC")
    List<Object[]> findRecentGradesWithStudentInfo(Pageable pageable);

    @Query("SELECT g FROM Grade g JOIN FETCH g.student s JOIN FETCH s.user WHERE g.createdBy.id = :userId ORDER BY g.createdAt DESC")
    List<Grade> findByCreatedByIdOrderByCreatedAtDesc(@Param("userId") UUID userId);

    boolean existsByCreatedById(UUID userId);

    long countByCreatedById(UUID userId);

    @Query("SELECT AVG(g.value) FROM Grade g")
    java.util.Optional<Double> findSchoolAverageGrade();

    long count();
}
