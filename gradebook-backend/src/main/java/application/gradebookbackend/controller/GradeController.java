package application.gradebookbackend.controller;

import application.gradebookbackend.controller.request.CreateGradeRequest;
import application.gradebookbackend.controller.response.GradeResponse;
import application.gradebookbackend.domain.Grade;
import application.gradebookbackend.domain.Subject;
import application.gradebookbackend.service.GradeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1.0/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @PostMapping
    public ResponseEntity<GradeResponse> createGrade(@RequestBody CreateGradeRequest createGradeRequest) {
        // TODO: Retrieve AppUser from security context
        Grade grade = gradeService.createGrade(
                createGradeRequest.studentId(),
                createGradeRequest.date(),
                Subject.valueOf(createGradeRequest.subject()),
                createGradeRequest.value(),
                createGradeRequest.comment(),
                null  // createdBy - retrieve from security context
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(GradeResponse.from(grade));
    }
}
