package application.gradebookbackend.controller;

import application.gradebookbackend.dto.AbsenceResponse;
import application.gradebookbackend.dto.GradeResponse;
import application.gradebookbackend.dto.StudentResponse;
import application.gradebookbackend.service.ParentViewService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/parent/me")
@PreAuthorize("hasRole('PARENT')")
public class ParentViewController {

    private final ParentViewService parentViewService;

    public ParentViewController(ParentViewService parentViewService) {
        this.parentViewService = parentViewService;
    }

    @GetMapping("/children")
    public List<StudentResponse> getMyChildren(@AuthenticationPrincipal Jwt jwt) {
        return parentViewService.getMyChildren(jwt.getSubject());
    }

    @GetMapping("/children/{studentId}/grades")
    public List<GradeResponse> getMyChildGrades(@PathVariable UUID studentId,
                                                @AuthenticationPrincipal Jwt jwt) {
        return parentViewService.getMyChildGrades(jwt.getSubject(), studentId);
    }

    @GetMapping("/children/{studentId}/absences")
    public List<AbsenceResponse> getMyChildAbsences(@PathVariable UUID studentId,
                                                    @AuthenticationPrincipal Jwt jwt) {
        return parentViewService.getMyChildAbsences(jwt.getSubject(), studentId);
    }
}
