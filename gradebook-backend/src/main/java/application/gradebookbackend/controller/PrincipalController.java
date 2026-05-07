package application.gradebookbackend.controller;

import application.gradebookbackend.dto.*;
import application.gradebookbackend.service.ParentService;
import application.gradebookbackend.service.StudentService;
import application.gradebookbackend.service.TeacherService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/principal")
@PreAuthorize("hasRole('PRINCIPAL')")
public class PrincipalController {

    private final TeacherService teacherService;
    private final StudentService studentService;
    private final ParentService parentService;

    public PrincipalController(TeacherService teacherService, StudentService studentService, ParentService parentService) {
        this.teacherService = teacherService;
        this.studentService = studentService;
        this.parentService = parentService;
    }

    @GetMapping("/stats")
    public PrincipalStatsResponse getStats() {
        return teacherService.getStats();
    }

    @GetMapping("/teachers")
    public List<TeacherResponse> listTeachers() {
        return teacherService.listTeachers();
    }

    @PostMapping("/teachers")
    @ResponseStatus(HttpStatus.CREATED)
    public TeacherResponse createTeacher(@Valid @RequestBody CreateTeacherRequest request) {
        return teacherService.createTeacher(request);
    }

    @PatchMapping("/teachers/{id}/block")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void blockTeacher(@PathVariable UUID id) {
        teacherService.blockTeacher(id);
    }

    @PatchMapping("/teachers/{id}/unblock")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unblockTeacher(@PathVariable UUID id) {
        teacherService.unblockTeacher(id);
    }

    @DeleteMapping("/teachers/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeacher(@PathVariable UUID id) {
        teacherService.deleteTeacher(id);
    }

    @GetMapping("/teachers/{id}/activity")
    public TeacherActivityResponse getTeacherActivity(@PathVariable UUID id) {
        return teacherService.getTeacherActivity(id);
    }

    @GetMapping("/students")
    public List<StudentRosterResponse> listStudents() {
        return studentService.listStudents();
    }

    @GetMapping("/parents")
    public List<ParentResponse> listParents() {
        return parentService.listParents();
    }
}
