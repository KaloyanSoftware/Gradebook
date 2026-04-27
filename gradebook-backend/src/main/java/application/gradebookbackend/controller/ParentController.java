package application.gradebookbackend.controller;

import application.gradebookbackend.dto.CreateParentRequest;
import application.gradebookbackend.dto.ParentResponse;
import application.gradebookbackend.dto.StudentResponse;
import application.gradebookbackend.service.ParentService;
import application.gradebookbackend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ParentResponse createParent(@Valid @RequestBody CreateParentRequest request) {
        return parentService.createParent(request);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ParentResponse> listParents() {
        return parentService.listParents();
    }

    // ADMIN can access any parent's students; PARENT can access this endpoint by role
    // — ownership check (parent can only see their own) is enforced in phase 2
    @GetMapping("/{parentId}/students")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PARENT')")
    public List<StudentResponse> listStudents(@PathVariable UUID parentId) {
        return studentService.listStudentsByParent(parentId);
    }

    @PatchMapping("/{parentId}/deactivate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deactivateParent(@PathVariable UUID parentId) {
        parentService.deactivateParent(parentId);
    }

    @PatchMapping("/{parentId}/activate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void activateParent(@PathVariable UUID parentId) {
        parentService.activateParent(parentId);
    }

    @DeleteMapping("/{parentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteParent(@PathVariable UUID parentId) {
        parentService.deleteParent(parentId);
    }
}
