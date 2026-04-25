package application.gradebookbackend.controller;

import application.gradebookbackend.dto.CreateParentRequest;
import application.gradebookbackend.dto.ParentResponse;
import application.gradebookbackend.dto.StudentResponse;
import application.gradebookbackend.service.ParentService;
import application.gradebookbackend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/parents")
public class ParentController {

    private final ParentService parentService;
    private final StudentService studentService;

    public ParentController(ParentService parentService, StudentService studentService) {
        this.parentService = parentService;
        this.studentService = studentService;
    }

    // TODO: add @PreAuthorize("hasRole('ADMIN')") once JWT security is configured
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ParentResponse createParent(@Valid @RequestBody CreateParentRequest request) {
        return parentService.createParent(request);
    }

    @GetMapping
    public List<ParentResponse> listParents() {
        return parentService.listParents();
    }

    @GetMapping("/{parentId}/students")
    public List<StudentResponse> listStudents(@PathVariable UUID parentId) {
        return studentService.listStudentsByParent(parentId);
    }
}
