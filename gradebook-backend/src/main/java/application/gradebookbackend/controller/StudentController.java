package application.gradebookbackend.controller;

import application.gradebookbackend.dto.CreateStudentRequest;
import application.gradebookbackend.dto.GradeResponse;
import application.gradebookbackend.dto.StudentResponse;
import application.gradebookbackend.dto.StudentRosterResponse;
import application.gradebookbackend.service.GradeService;
import application.gradebookbackend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/students")
public class StudentController {

    private final StudentService studentService;
    private final GradeService gradeService;

    public StudentController(StudentService studentService, GradeService gradeService) {
        this.studentService = studentService;
        this.gradeService = gradeService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<StudentRosterResponse> listStudents() {
        return studentService.listStudents();
    }

    // ADMIN can see any student's grades; STUDENT can access this endpoint by role
    // — ownership check (student can only see their own) is enforced in phase 2
    @GetMapping("/{studentId}/grades")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public List<GradeResponse> listGrades(@PathVariable UUID studentId) {
        return gradeService.listGradesForStudent(studentId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public StudentResponse createStudent(@Valid @RequestBody CreateStudentRequest request) {
        return studentService.createStudent(request);
    }

    @PatchMapping("/{studentId}/deactivate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deactivateStudent(@PathVariable UUID studentId) {
        studentService.deactivateStudent(studentId);
    }

    @PatchMapping("/{studentId}/activate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void activateStudent(@PathVariable UUID studentId) {
        studentService.activateStudent(studentId);
    }

    @DeleteMapping("/{studentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteStudent(@PathVariable UUID studentId) {
        studentService.deleteStudent(studentId);
    }
}
