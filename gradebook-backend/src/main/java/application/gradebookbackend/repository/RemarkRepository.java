package application.gradebookbackend.repository;

import application.gradebookbackend.domain.Remark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RemarkRepository extends JpaRepository<Remark, UUID> {

    List<Remark> findByStudentIdOrderByDateDesc(UUID studentId);
}
