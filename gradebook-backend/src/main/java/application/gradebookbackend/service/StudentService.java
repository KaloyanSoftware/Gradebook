package application.gradebookbackend.service;

import application.gradebookbackend.domain.*;
import application.gradebookbackend.dto.CreateStudentRequest;
import application.gradebookbackend.dto.StudentResponse;
import application.gradebookbackend.dto.StudentRosterResponse;
import application.gradebookbackend.exception.DuplicateEmailException;
import application.gradebookbackend.exception.ResourceNotFoundException;
import application.gradebookbackend.repository.AppUserRepository;
import application.gradebookbackend.repository.EnrollmentRepository;
import application.gradebookbackend.repository.ParentRepository;
import application.gradebookbackend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class StudentService {

    private final AppUserRepository appUserRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final EnrollmentRepository enrollmentRepository;

    public StudentService(
            AppUserRepository appUserRepository,
            StudentRepository studentRepository,
            ParentRepository parentRepository,
            EnrollmentRepository enrollmentRepository) {
        this.appUserRepository = appUserRepository;
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional
    public StudentResponse createStudent(CreateStudentRequest request) {
        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        Parent parent = parentRepository.findById(request.getParentId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent", request.getParentId()));

        // TODO: call Supabase Admin API here to create the auth user with request.getEmail()
        //   and request.getPassword(). On success, use the returned UID as externalUid below.
        AppUser user = new AppUser();
        user.setExternalUid(UUID.randomUUID().toString()); // placeholder until Supabase is integrated
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(Role.STUDENT);
        AppUser savedUser = appUserRepository.save(user);

        Student student = new Student();
        student.setUser(savedUser);
        Student savedStudent = studentRepository.save(student);

        Enrollment enrollment = new Enrollment();
        enrollment.setParent(parent);
        enrollment.setStudent(savedStudent);
        enrollmentRepository.save(enrollment);

        return StudentResponse.from(savedStudent);
    }

    public List<StudentRosterResponse> listStudents() {
        return studentRepository.findAll().stream()
                .map(student -> {
                    List<String> parentNames = enrollmentRepository.findByStudentId(student.getId()).stream()
                            .map(e -> e.getParent().getUser().getFirstName() + " " + e.getParent().getUser().getLastName())
                            .toList();
                    return StudentRosterResponse.from(student, parentNames);
                })
                .toList();
    }

    public List<StudentResponse> listStudentsByParent(UUID parentId) {
        parentRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", parentId));

        return enrollmentRepository.findByParentId(parentId).stream()
                .map(enrollment -> StudentResponse.from(enrollment.getStudent()))
                .toList();
    }
}
