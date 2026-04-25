package application.gradebookbackend.controller;

import application.gradebookbackend.dto.CreateParentRequest;
import application.gradebookbackend.dto.ParentResponse;
import application.gradebookbackend.service.ParentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/parents")
public class ParentController {

    private final ParentService parentService;

    public ParentController(ParentService parentService) {
        this.parentService = parentService;
    }

    // TODO: add @PreAuthorize("hasRole('ADMIN')") once JWT security is configured
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ParentResponse createParent(@Valid @RequestBody CreateParentRequest request) {
        return parentService.createParent(request);
    }
}
