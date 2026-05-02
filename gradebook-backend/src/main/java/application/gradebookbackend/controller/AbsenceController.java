package application.gradebookbackend.controller;

import application.gradebookbackend.dto.AbsenceResponse;
import application.gradebookbackend.dto.CreateAbsenceRequest;
import application.gradebookbackend.dto.UpdateAbsenceRequest;
import application.gradebookbackend.service.AbsenceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/absences")
@PreAuthorize("hasRole('ADMIN')")
public class AbsenceController {

    private final AbsenceService absenceService;

    public AbsenceController(AbsenceService absenceService) {
        this.absenceService = absenceService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AbsenceResponse createAbsence(@Valid @RequestBody CreateAbsenceRequest request) {
        return absenceService.createAbsence(request);
    }

    @PutMapping("/{absenceId}")
    public AbsenceResponse updateAbsence(@PathVariable UUID absenceId,
                                         @Valid @RequestBody UpdateAbsenceRequest request) {
        return absenceService.updateAbsence(absenceId, request);
    }

    @DeleteMapping("/{absenceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAbsence(@PathVariable UUID absenceId) {
        absenceService.deleteAbsence(absenceId);
    }
}
