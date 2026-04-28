package application.gradebookbackend.service;

import application.gradebookbackend.domain.*;
import application.gradebookbackend.dto.NotificationResponse;
import application.gradebookbackend.exception.ResourceNotFoundException;
import application.gradebookbackend.repository.AppUserRepository;
import application.gradebookbackend.repository.EnrollmentRepository;
import application.gradebookbackend.repository.NotificationRepository;
import application.gradebookbackend.repository.ParentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AppUserRepository appUserRepository;
    private final ParentRepository parentRepository;

    public NotificationService(NotificationRepository notificationRepository,
                                EnrollmentRepository enrollmentRepository,
                                AppUserRepository appUserRepository,
                                ParentRepository parentRepository) {
        this.notificationRepository = notificationRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.appUserRepository = appUserRepository;
        this.parentRepository = parentRepository;
    }

    @Transactional
    public void notifyParentsOfAbsence(Student student, Absence absence) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentIdWithParent(student.getId());

        String studentName = student.getUser().getFirstName() + " " + student.getUser().getLastName();
        String dateStr = absence.getDate().toString();
        String message = "Ново отсъствие за " + studentName + " на " + dateStr;
        if (absence.getReason() != null && !absence.getReason().isBlank()) {
            message += " (" + absence.getReason() + ")";
        }

        for (Enrollment enrollment : enrollments) {
            Notification notification = new Notification();
            notification.setParent(enrollment.getParent());
            notification.setType(NotificationType.NEW_ABSENCE);
            notification.setMessage(message);
            notification.setSourceId(absence.getId());
            notification.setSourceType(SourceType.ABSENCE);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void notifyParentsOfGrade(Student student, Grade grade) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentIdWithParent(student.getId());

        String studentName = student.getUser().getFirstName() + " " + student.getUser().getLastName();
        String subjectLabel = subjectLabel(grade.getSubject());
        String valueStr = grade.getValue().stripTrailingZeros().toPlainString();
        String message = "Нова оценка по " + subjectLabel + " за " + studentName + ": " + valueStr;

        for (Enrollment enrollment : enrollments) {
            Notification notification = new Notification();
            notification.setParent(enrollment.getParent());
            notification.setType(NotificationType.NEW_GRADE);
            notification.setMessage(message);
            if (grade.getId() != null) {
                notification.setSourceId(grade.getId());
            }
            notification.setSourceType(SourceType.GRADE);
            notificationRepository.save(notification);
        }
    }

    public List<NotificationResponse> getNotificationsForParent(String externalUid) {
        Parent parent = findParentByExternalUid(externalUid);
        return notificationRepository.findByParentIdOrderByCreatedAtDesc(parent.getId())
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }

    public long getUnreadCount(String externalUid) {
        Parent parent = findParentByExternalUid(externalUid);
        return notificationRepository.countByParentIdAndIsReadFalse(parent.getId());
    }

    @Transactional
    public void markAllRead(String externalUid) {
        Parent parent = findParentByExternalUid(externalUid);
        notificationRepository.markAllReadByParentId(parent.getId());
    }

    @Transactional
    public void markRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    private Parent findParentByExternalUid(String externalUid) {
        AppUser user = appUserRepository.findByExternalUid(externalUid)
                .orElseThrow(() -> new ResourceNotFoundException("AppUser", externalUid));
        return parentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent", user.getId()));
    }

    private String subjectLabel(Subject subject) {
        return switch (subject) {
            case BULGARIAN -> "Български език";
            case LITERATURE -> "Литература";
        };
    }
}
