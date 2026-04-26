package application.gradebookbackend.controller;

import application.gradebookbackend.dto.CreateStudentRequest;
import application.gradebookbackend.dto.GradeResponse;
import application.gradebookbackend.dto.StudentResponse;
import application.gradebookbackend.dto.StudentRosterResponse;
import application.gradebookbackend.service.GradeService;
import application.gradebookbackend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public List<StudentRosterResponse> listStudents() {
        return studentService.listStudents();
    }

    @GetMapping("/{studentId}/grades")
    public List<GradeResponse> listGrades(@PathVariable UUID studentId) {
        return gradeService.listGradesForStudent(studentId);
    }

    // TODO: pass authenticated admin user as createdBy once JWT is wired up
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentResponse createStudent(@Valid @RequestBody CreateStudentRequest request) {
        return studentService.createStudent(request);
    }
}
