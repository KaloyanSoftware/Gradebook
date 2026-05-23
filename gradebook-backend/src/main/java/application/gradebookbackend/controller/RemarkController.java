package application.gradebookbackend.controller;

import application.gradebookbackend.dto.CreateRemarkRequest;
import application.gradebookbackend.dto.RemarkResponse;
import application.gradebookbackend.dto.UpdateRemarkRequest;
import application.gradebookbackend.service.RemarkService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/remarks")
@PreAuthorize("hasRole('ADMIN')")
public class RemarkController {

    private final RemarkService remarkService;

    public RemarkController(RemarkService remarkService) {
        this.remarkService = remarkService;
    }

    @GetMapping("/student/{studentId}")
    public List<RemarkResponse> listRemarksForStudent(@PathVariable UUID studentId) {
        return remarkService.listRemarksForStudent(studentId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RemarkResponse createRemark(@Valid @RequestBody CreateRemarkRequest request) {
        return remarkService.createRemark(request);
    }

    @PutMapping("/{remarkId}")
    public RemarkResponse updateRemark(@PathVariable UUID remarkId,
                                       @Valid @RequestBody UpdateRemarkRequest request) {
        return remarkService.updateRemark(remarkId, request);
    }

    @DeleteMapping("/{remarkId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRemark(@PathVariable UUID remarkId) {
        remarkService.deleteRemark(remarkId);
    }
}
