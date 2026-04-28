package application.gradebookbackend.service;

import application.gradebookbackend.domain.Absence;
import application.gradebookbackend.domain.Student;
import application.gradebookbackend.dto.AbsenceResponse;
import application.gradebookbackend.dto.CreateAbsenceRequest;
import application.gradebookbackend.dto.UpdateAbsenceRequest;
import application.gradebookbackend.exception.ResourceNotFoundException;
import application.gradebookbackend.repository.AbsenceRepository;
import application.gradebookbackend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AbsenceService {

    private final AbsenceRepository absenceRepository;
    private final StudentRepository studentRepository;
    private final NotificationService notificationService;

    public AbsenceService(AbsenceRepository absenceRepository, StudentRepository studentRepository,
                          NotificationService notificationService) {
        this.absenceRepository = absenceRepository;
        this.studentRepository = studentRepository;
        this.notificationService = notificationService;
    }

    public List<AbsenceResponse> listAbsencesForStudent(UUID studentId) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));
        return absenceRepository.findByStudentIdOrderByDateDesc(studentId)
                .stream()
                .map(AbsenceResponse::from)
                .toList();
    }

    @Transactional
    public AbsenceResponse createAbsence(CreateAbsenceRequest request) {
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", request.studentId()));

        Absence absence = new Absence();
        absence.setStudent(student);
        absence.setDate(request.date());
        absence.setReason(request.reason());

        Absence savedAbsence = absenceRepository.save(absence);
        notificationService.notifyParentsOfAbsence(student, savedAbsence);
        return AbsenceResponse.from(savedAbsence);
    }

    @Transactional
    public AbsenceResponse updateAbsence(UUID absenceId, UpdateAbsenceRequest request) {
        Absence absence = absenceRepository.findById(absenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Absence", absenceId));

        absence.setDate(request.date());
        absence.setReason(request.reason());

        return AbsenceResponse.from(absenceRepository.save(absence));
    }

    @Transactional
    public void deleteAbsence(UUID absenceId) {
        if (!absenceRepository.existsById(absenceId)) {
            throw new ResourceNotFoundException("Absence", absenceId);
        }
        absenceRepository.deleteById(absenceId);
    }
}
