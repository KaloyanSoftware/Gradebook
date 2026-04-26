package application.gradebookbackend.service;

import application.gradebookbackend.client.SupabaseAdminClient;
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
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final AppUserRepository appUserRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final SupabaseAdminClient supabaseAdminClient;

    public StudentService(
            AppUserRepository appUserRepository,
            StudentRepository studentRepository,
            ParentRepository parentRepository,
            EnrollmentRepository enrollmentRepository,
            SupabaseAdminClient supabaseAdminClient) {
        this.appUserRepository = appUserRepository;
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.supabaseAdminClient = supabaseAdminClient;
    }

    @Transactional
    public StudentResponse createStudent(CreateStudentRequest request) {
        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        Parent parent = parentRepository.findById(request.getParentId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent", request.getParentId()));

        String authUid = supabaseAdminClient.createAuthUser(request.getEmail(), request.getPassword());

        try {
            AppUser user = new AppUser();
            user.setExternalUid(authUid);
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
        } catch (Exception e) {
            supabaseAdminClient.deleteAuthUser(authUid);
            throw e;
        }
    }

    public List<StudentRosterResponse> listStudents() {
        List<Student> students = studentRepository.findAll();

        Map<UUID, List<String>> parentNamesByStudent = enrollmentRepository.findAllWithParentAndUser()
                .stream()
                .collect(Collectors.groupingBy(
                        e -> e.getStudent().getId(),
                        Collectors.mapping(
                                e -> e.getParent().getUser().getFirstName() + " " + e.getParent().getUser().getLastName(),
                                Collectors.toList()
                        )
                ));

        return students.stream()
                .map(s -> StudentRosterResponse.from(s, parentNamesByStudent.getOrDefault(s.getId(), List.of())))
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
