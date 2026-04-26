package application.gradebookbackend.service;

import application.gradebookbackend.domain.AppUser;
import application.gradebookbackend.domain.Grade;
import application.gradebookbackend.domain.Student;
import application.gradebookbackend.domain.Subject;
import application.gradebookbackend.dto.GradeResponse;
import application.gradebookbackend.dto.UpdateGradeRequest;
import application.gradebookbackend.exception.ResourceNotFoundException;
import application.gradebookbackend.repository.GradeRepository;
import application.gradebookbackend.repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class GradeService {

    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;

    public GradeService(StudentRepository studentRepository, GradeRepository gradeRepository) {
        this.studentRepository = studentRepository;
        this.gradeRepository = gradeRepository;
    }

    public Grade createGrade(UUID studentId, LocalDate date, Subject subject, BigDecimal value, String comment, AppUser createdBy) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        Grade grade = new Grade();
        grade.setDate(date);
        grade.setSubject(subject);
        grade.setValue(value);
        grade.setComment(comment);
        grade.setCreatedBy(createdBy);

        student.addGrade(grade);
        studentRepository.save(student);

        return grade;
    }

    public List<GradeResponse> listGradesForStudent(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        return student.getGrades().stream()
                .sorted(Comparator.comparing(Grade::getDate).reversed())
                .map(GradeResponse::from)
                .toList();
    }

    public GradeResponse updateGrade(UUID gradeId, UpdateGradeRequest request) {
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade", gradeId));

        grade.setDate(request.date());
        grade.setSubject(Subject.valueOf(request.subject()));
        grade.setValue(request.value());
        grade.setComment(request.comment());

        return GradeResponse.from(gradeRepository.save(grade));
    }

    public void deleteGrade(UUID gradeId) {
        if (!gradeRepository.existsById(gradeId)) {
            throw new ResourceNotFoundException("Grade", gradeId);
        }
        gradeRepository.deleteById(gradeId);
    }
}
