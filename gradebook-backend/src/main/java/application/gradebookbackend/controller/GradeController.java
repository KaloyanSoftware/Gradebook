package application.gradebookbackend.controller;

import application.gradebookbackend.domain.Subject;
import application.gradebookbackend.dto.CreateGradeRequest;
import application.gradebookbackend.dto.GradeResponse;
import application.gradebookbackend.dto.UpdateGradeRequest;
import application.gradebookbackend.service.GradeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/grades")
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

    @PutMapping("/{gradeId}")
    public GradeResponse updateGrade(@PathVariable UUID gradeId,
                                     @Valid @RequestBody UpdateGradeRequest request) {
        return gradeService.updateGrade(gradeId, request);
    }

    @DeleteMapping("/{gradeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGrade(@PathVariable UUID gradeId) {
        gradeService.deleteGrade(gradeId);
    }
}
