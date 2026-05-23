package application.gradebookbackend.service;

import application.gradebookbackend.domain.Praise;
import application.gradebookbackend.domain.Student;
import application.gradebookbackend.dto.CreatePraiseRequest;
import application.gradebookbackend.dto.PraiseResponse;
import application.gradebookbackend.dto.UpdatePraiseRequest;
import application.gradebookbackend.exception.ResourceNotFoundException;
import application.gradebookbackend.repository.PraiseRepository;
import application.gradebookbackend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PraiseService {

    private final PraiseRepository praiseRepository;
    private final StudentRepository studentRepository;
    private final NotificationService notificationService;

    public PraiseService(PraiseRepository praiseRepository, StudentRepository studentRepository,
                         NotificationService notificationService) {
        this.praiseRepository = praiseRepository;
        this.studentRepository = studentRepository;
        this.notificationService = notificationService;
    }

    public List<PraiseResponse> listPraisesForStudent(UUID studentId) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));
        return praiseRepository.findByStudentIdOrderByDateDesc(studentId)
                .stream()
                .map(PraiseResponse::from)
                .toList();
    }

    @Transactional
    public PraiseResponse createPraise(CreatePraiseRequest request) {
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", request.studentId()));

        Praise praise = new Praise();
        praise.setStudent(student);
        praise.setDate(request.date());
        praise.setContent(request.content());

        Praise saved = praiseRepository.save(praise);
        notificationService.notifyParentsOfPraise(student, saved);
        return PraiseResponse.from(saved);
    }

    @Transactional
    public PraiseResponse updatePraise(UUID praiseId, UpdatePraiseRequest request) {
        Praise praise = praiseRepository.findById(praiseId)
                .orElseThrow(() -> new ResourceNotFoundException("Praise", praiseId));

        praise.setDate(request.date());
        praise.setContent(request.content());

        return PraiseResponse.from(praiseRepository.save(praise));
    }

    @Transactional
    public void deletePraise(UUID praiseId) {
        if (!praiseRepository.existsById(praiseId)) {
            throw new ResourceNotFoundException("Praise", praiseId);
        }
        praiseRepository.deleteById(praiseId);
    }
}
