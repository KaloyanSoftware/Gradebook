package application.gradebookbackend.service;

import application.gradebookbackend.domain.Remark;
import application.gradebookbackend.domain.Student;
import application.gradebookbackend.dto.CreateRemarkRequest;
import application.gradebookbackend.dto.RemarkResponse;
import application.gradebookbackend.dto.UpdateRemarkRequest;
import application.gradebookbackend.exception.ResourceNotFoundException;
import application.gradebookbackend.repository.RemarkRepository;
import application.gradebookbackend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class RemarkService {

    private final RemarkRepository remarkRepository;
    private final StudentRepository studentRepository;

    public RemarkService(RemarkRepository remarkRepository, StudentRepository studentRepository) {
        this.remarkRepository = remarkRepository;
        this.studentRepository = studentRepository;
    }

    public List<RemarkResponse> listRemarksForStudent(UUID studentId) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", studentId));
        return remarkRepository.findByStudentIdOrderByDateDesc(studentId)
                .stream()
                .map(RemarkResponse::from)
                .toList();
    }

    @Transactional
    public RemarkResponse createRemark(CreateRemarkRequest request) {
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", request.studentId()));

        Remark remark = new Remark();
        remark.setStudent(student);
        remark.setDate(request.date());
        remark.setContent(request.content());

        return RemarkResponse.from(remarkRepository.save(remark));
    }

    @Transactional
    public RemarkResponse updateRemark(UUID remarkId, UpdateRemarkRequest request) {
        Remark remark = remarkRepository.findById(remarkId)
                .orElseThrow(() -> new ResourceNotFoundException("Remark", remarkId));

        remark.setDate(request.date());
        remark.setContent(request.content());

        return RemarkResponse.from(remarkRepository.save(remark));
    }

    @Transactional
    public void deleteRemark(UUID remarkId) {
        if (!remarkRepository.existsById(remarkId)) {
            throw new ResourceNotFoundException("Remark", remarkId);
        }
        remarkRepository.deleteById(remarkId);
    }
}
