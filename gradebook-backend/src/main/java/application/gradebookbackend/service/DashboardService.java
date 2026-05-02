package application.gradebookbackend.service;

import application.gradebookbackend.domain.Absence;
import application.gradebookbackend.domain.Subject;
import application.gradebookbackend.dto.DashboardResponse;
import application.gradebookbackend.dto.RecentAbsenceActivity;
import application.gradebookbackend.dto.RecentGradeActivity;
import application.gradebookbackend.repository.AbsenceRepository;
import application.gradebookbackend.repository.GradeRepository;
import application.gradebookbackend.repository.ParentRepository;
import application.gradebookbackend.repository.StudentRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final GradeRepository gradeRepository;
    private final AbsenceRepository absenceRepository;

    public DashboardService(StudentRepository studentRepository,
                            ParentRepository parentRepository,
                            GradeRepository gradeRepository,
                            AbsenceRepository absenceRepository) {
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
        this.gradeRepository = gradeRepository;
        this.absenceRepository = absenceRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalParents = parentRepository.count();

        List<Object[]> gradeRows = gradeRepository.findRecentGradesWithStudentInfo(PageRequest.of(0, 3));
        List<RecentGradeActivity> recentGrades = gradeRows.stream()
                .map(row -> new RecentGradeActivity(
                        (UUID) row[0],
                        ((Subject) row[1]).name(),
                        (BigDecimal) row[2],
                        (LocalDate) row[3],
                        (UUID) row[5],
                        row[6] + " " + row[7],
                        (LocalDateTime) row[4]
                ))
                .toList();

        List<Absence> recentAbsenceEntities = absenceRepository.findRecentAbsencesWithStudent(PageRequest.of(0, 3));
        List<RecentAbsenceActivity> recentAbsences = recentAbsenceEntities.stream()
                .map(a -> new RecentAbsenceActivity(
                        a.getId(),
                        a.getDate(),
                        a.getReason(),
                        a.getStudent().getId(),
                        a.getStudent().getUser().getFirstName() + " " + a.getStudent().getUser().getLastName(),
                        a.getCreatedAt()
                ))
                .toList();

        return new DashboardResponse(totalStudents, totalParents, recentGrades, recentAbsences);
    }
}
