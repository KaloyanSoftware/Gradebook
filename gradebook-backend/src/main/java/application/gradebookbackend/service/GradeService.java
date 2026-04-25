package application.gradebookbackend.service;

import application.gradebookbackend.domain.AppUser;
import application.gradebookbackend.domain.Grade;
import application.gradebookbackend.domain.Student;
import application.gradebookbackend.domain.Subject;
import application.gradebookbackend.repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
@Transactional
public class GradeService {

    private final StudentRepository studentRepository;

    public GradeService(final StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Grade createGrade(UUID studentId, LocalDate date, Subject subject, BigDecimal value, String comment, AppUser createdBy) {
        Grade grade = new Grade();

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + studentId));

        grade.setDate(date);
        grade.setSubject(subject);
        grade.setValue(value);
        grade.setComment(comment);
        grade.setCreatedBy(createdBy);

        student.addGrade(grade);

        studentRepository.save(student);

        return grade;
    }
}
