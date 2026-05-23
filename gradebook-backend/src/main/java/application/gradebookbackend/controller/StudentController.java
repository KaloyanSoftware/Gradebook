package application.gradebookbackend.controller;

import application.gradebookbackend.dto.AbsenceResponse;
import application.gradebookbackend.dto.CreateStudentRequest;
import application.gradebookbackend.dto.GradeResponse;
import application.gradebookbackend.dto.PraiseResponse;
import application.gradebookbackend.dto.RemarkResponse;
import application.gradebookbackend.dto.StudentResponse;
import application.gradebookbackend.dto.StudentRosterResponse;
import application.gradebookbackend.service.AbsenceService;
import application.gradebookbackend.service.GradeService;
import application.gradebookbackend.service.PraiseService;
import application.gradebookbackend.service.RemarkService;
import application.gradebookbackend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/students")
public class StudentController {

    private final StudentService studentService;
    private final GradeService gradeService;
    private final AbsenceService absenceService;
    private final RemarkService remarkService;
    private final PraiseService praiseService;

    public StudentController(StudentService studentService, GradeService gradeService,
                             AbsenceService absenceService, RemarkService remarkService,
                             PraiseService praiseService) {
        this.studentService = studentService;
        this.gradeService = gradeService;
        this.absenceService = absenceService;
        this.remarkService = remarkService;
        this.praiseService = praiseService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<StudentRosterResponse> listStudents() {
        return studentService.listStudents();
    }

    // ADMIN can see any student's grades; STUDENT can access this endpoint by role
    // — ownership check (student can only see their own) is enforced in phase 2
    @GetMapping("/{studentId}/grades")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public List<GradeResponse> listGrades(@PathVariable UUID studentId) {
        return gradeService.listGradesForStudent(studentId);
    }

    @GetMapping("/{studentId}/absences")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public List<AbsenceResponse> listAbsences(@PathVariable UUID studentId) {
        return absenceService.listAbsencesForStudent(studentId);
    }

    @GetMapping("/{studentId}/remarks")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public List<RemarkResponse> listRemarks(@PathVariable UUID studentId) {
        return remarkService.listRemarksForStudent(studentId);
    }

    @GetMapping("/{studentId}/praises")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public List<PraiseResponse> listPraises(@PathVariable UUID studentId) {
        return praiseService.listPraisesForStudent(studentId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public StudentResponse createStudent(@Valid @RequestBody CreateStudentRequest request) {
        return studentService.createStudent(request);
    }

    @PatchMapping("/{studentId}/deactivate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deactivateStudent(@PathVariable UUID studentId) {
        studentService.deactivateStudent(studentId);
    }

    @PatchMapping("/{studentId}/activate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void activateStudent(@PathVariable UUID studentId) {
        studentService.activateStudent(studentId);
    }

    @DeleteMapping("/{studentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteStudent(@PathVariable UUID studentId) {
        studentService.deleteStudent(studentId);
    }
}
