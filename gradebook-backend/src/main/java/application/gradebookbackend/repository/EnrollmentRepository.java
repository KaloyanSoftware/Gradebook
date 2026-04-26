package application.gradebookbackend.repository;

import application.gradebookbackend.domain.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {

    List<Enrollment> findByParentId(UUID parentId);

    List<Enrollment> findByStudentId(UUID studentId);
}
