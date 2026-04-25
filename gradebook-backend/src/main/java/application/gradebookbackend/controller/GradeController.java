package application.gradebookbackend.controller;

import application.gradebookbackend.domain.Subject;
import application.gradebookbackend.dto.CreateGradeRequest;
import application.gradebookbackend.dto.GradeResponse;
import application.gradebookbackend.service.GradeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/grades")
@PreAuthorize("hasRole('ADMIN')")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    // TODO: pass authenticated admin user as createdBy once JWT is wired up
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GradeResponse createGrade(@Valid @RequestBody CreateGradeRequest request) {

        var grade = gradeService.createGrade(
                request.studentId(),
                request.date(),
                Subject.valueOf(request.subject()),
                request.value(),
                request.comment(),
                null
        );
        return GradeResponse.from(grade);
    }
}
