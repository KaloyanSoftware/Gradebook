package application.gradebookbackend.service;

import application.gradebookbackend.domain.Student;
import application.gradebookbackend.dto.AbsenceResponse;
import application.gradebookbackend.dto.GradeResponse;
import application.gradebookbackend.dto.PraiseResponse;
import application.gradebookbackend.dto.RemarkResponse;
import application.gradebookbackend.exception.ResourceNotFoundException;
import application.gradebookbackend.repository.AppUserRepository;
import application.gradebookbackend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentViewService {

    private final AppUserRepository appUserRepository;
    private final StudentRepository studentRepository;
    private final GradeService gradeService;
    private final AbsenceService absenceService;
    private final RemarkService remarkService;
    private final PraiseService praiseService;

    public StudentViewService(AppUserRepository appUserRepository,
                              StudentRepository studentRepository,
                              GradeService gradeService,
                              AbsenceService absenceService,
                              RemarkService remarkService,
                              PraiseService praiseService) {
        this.appUserRepository = appUserRepository;
        this.studentRepository = studentRepository;
        this.gradeService = gradeService;
        this.absenceService = absenceService;
        this.remarkService = remarkService;
        this.praiseService = praiseService;
    }

    public List<GradeResponse> getMyGrades(String externalUid) {
        Student student = findStudentByExternalUid(externalUid);
        return gradeService.listGradesForStudent(student.getId());
    }

    public List<AbsenceResponse> getMyAbsences(String externalUid) {
        Student student = findStudentByExternalUid(externalUid);
        return absenceService.listAbsencesForStudent(student.getId());
    }

    public List<RemarkResponse> getMyRemarks(String externalUid) {
        Student student = findStudentByExternalUid(externalUid);
        return remarkService.listRemarksForStudent(student.getId());
    }

    public List<PraiseResponse> getMyPraises(String externalUid) {
        Student student = findStudentByExternalUid(externalUid);
        return praiseService.listPraisesForStudent(student.getId());
    }

    private Student findStudentByExternalUid(String externalUid) {
        var user = appUserRepository.findByExternalUid(externalUid)
                .orElseThrow(() -> new ResourceNotFoundException("AppUser", externalUid));
        return studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", user.getId()));
    }
}
