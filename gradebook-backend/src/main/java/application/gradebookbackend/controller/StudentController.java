package application.gradebookbackend.controller;

import application.gradebookbackend.dto.CreateStudentRequest;
import application.gradebookbackend.dto.StudentResponse;
import application.gradebookbackend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // TODO: pass authenticated admin user as createdBy once JWT is wired up
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentResponse createStudent(@Valid @RequestBody CreateStudentRequest request) {
        return studentService.createStudent(request);
    }
}
