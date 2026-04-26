package application.gradebookbackend.repository;

import application.gradebookbackend.domain.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.student s JOIN FETCH s.user WHERE e.parent.id = :parentId")
    List<Enrollment> findByParentId(@Param("parentId") UUID parentId);

    List<Enrollment> findByStudentId(UUID studentId);

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.parent p JOIN FETCH p.user JOIN FETCH e.student s JOIN FETCH s.user")
    List<Enrollment> findAllWithParentAndUser();
}
