package application.gradebookbackend.controller;

import application.gradebookbackend.domain.Subject;
import application.gradebookbackend.dto.CreateGradeRequest;
import application.gradebookbackend.dto.GradeResponse;
import application.gradebookbackend.dto.UpdateGradeRequest;
import application.gradebookbackend.service.GradeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/grades")
@PreAuthorize("hasRole('ADMIN')")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GradeResponse createGrade(@Valid @RequestBody CreateGradeRequest request,
                                     @AuthenticationPrincipal Jwt jwt) {
        String externalUid = jwt.getSubject();

        var grade = gradeService.createGrade(
                request.studentId(),
                request.date(),
                Subject.valueOf(request.subject()),
                request.value(),
                request.comment(),
                externalUid
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