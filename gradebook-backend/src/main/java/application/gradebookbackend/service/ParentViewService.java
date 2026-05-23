package application.gradebookbackend.service;

import application.gradebookbackend.domain.Enrollment;
import application.gradebookbackend.domain.Parent;
import application.gradebookbackend.dto.AbsenceResponse;
import application.gradebookbackend.dto.GradeResponse;
import application.gradebookbackend.dto.PraiseResponse;
import application.gradebookbackend.dto.RemarkResponse;
import application.gradebookbackend.dto.StudentResponse;
import application.gradebookbackend.exception.ResourceNotFoundException;
import application.gradebookbackend.repository.AppUserRepository;
import application.gradebookbackend.repository.EnrollmentRepository;
import application.gradebookbackend.repository.ParentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ParentViewService {

    private final AppUserRepository appUserRepository;
    private final ParentRepository parentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final GradeService gradeService;
    private final AbsenceService absenceService;
    private final RemarkService remarkService;
    private final PraiseService praiseService;

    public ParentViewService(AppUserRepository appUserRepository,
                             ParentRepository parentRepository,
                             EnrollmentRepository enrollmentRepository,
                             GradeService gradeService,
                             AbsenceService absenceService,
                             RemarkService remarkService,
                             PraiseService praiseService) {
        this.appUserRepository = appUserRepository;
        this.parentRepository = parentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.gradeService = gradeService;
        this.absenceService = absenceService;
        this.remarkService = remarkService;
        this.praiseService = praiseService;
    }

    public List<StudentResponse> getMyChildren(String externalUid) {
        Parent parent = findParentByExternalUid(externalUid);
        return enrollmentRepository.findByParentId(parent.getId())
                .stream()
                .map(e -> StudentResponse.from(e.getStudent()))
                .toList();
    }

    public List<GradeResponse> getMyChildGrades(String externalUid, UUID studentId) {
        ensureParentOwnsStudent(externalUid, studentId);
        return gradeService.listGradesForStudent(studentId);
    }

    public List<AbsenceResponse> getMyChildAbsences(String externalUid, UUID studentId) {
        ensureParentOwnsStudent(externalUid, studentId);
        return absenceService.listAbsencesForStudent(studentId);
    }

    public List<RemarkResponse> getMyChildRemarks(String externalUid, UUID studentId) {
        ensureParentOwnsStudent(externalUid, studentId);
        return remarkService.listRemarksForStudent(studentId);
    }

    public List<PraiseResponse> getMyChildPraises(String externalUid, UUID studentId) {
        ensureParentOwnsStudent(externalUid, studentId);
        return praiseService.listPraisesForStudent(studentId);
    }

    private void ensureParentOwnsStudent(String externalUid, UUID studentId) {
        Parent parent = findParentByExternalUid(externalUid);
        List<Enrollment> enrollments = enrollmentRepository.findByParentId(parent.getId());
        boolean linked = enrollments.stream()
                .anyMatch(e -> e.getStudent().getId().equals(studentId));
        if (!linked) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Access denied: student is not linked to this parent");
        }
    }

    private Parent findParentByExternalUid(String externalUid) {
        var user = appUserRepository.findByExternalUid(externalUid)
                .orElseThrow(() -> new ResourceNotFoundException("AppUser", externalUid));
        return parentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent", user.getId()));
    }
}
