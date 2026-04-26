package application.gradebookbackend.service;

import application.gradebookbackend.domain.AppUser;
import application.gradebookbackend.domain.Grade;
import application.gradebookbackend.domain.Student;
import application.gradebookbackend.domain.Subject;
import application.gradebookbackend.exception.ResourceNotFoundException;
import application.gradebookbackend.repository.AppUserRepository;
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
    private final AppUserRepository appUserRepository;

    public GradeService(StudentRepository studentRepository, AppUserRepository appUserRepository) {
        this.studentRepository = studentRepository;
        this.appUserRepository = appUserRepository;
    }

    public Grade createGrade(UUID studentId, LocalDate date, Subject subject, BigDecimal value, String comment, String externalUid) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));

        AppUser createdBy = appUserRepository.findByExternalUid(externalUid)
                .orElseThrow(() -> new ResourceNotFoundException("AppUser", externalUid));

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
}