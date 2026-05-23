package application.gradebookbackend.controller;

import application.gradebookbackend.dto.CreatePraiseRequest;
import application.gradebookbackend.dto.PraiseResponse;
import application.gradebookbackend.dto.UpdatePraiseRequest;
import application.gradebookbackend.service.PraiseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/praises")
@PreAuthorize("hasRole('ADMIN')")
public class PraiseController {

    private final PraiseService praiseService;

    public PraiseController(PraiseService praiseService) {
        this.praiseService = praiseService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PraiseResponse createPraise(@Valid @RequestBody CreatePraiseRequest request) {
        return praiseService.createPraise(request);
    }

    @PutMapping("/{praiseId}")
    public PraiseResponse updatePraise(@PathVariable UUID praiseId,
                                       @Valid @RequestBody UpdatePraiseRequest request) {
        return praiseService.updatePraise(praiseId, request);
    }

    @DeleteMapping("/{praiseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePraise(@PathVariable UUID praiseId) {
        praiseService.deletePraise(praiseId);
    }
}
