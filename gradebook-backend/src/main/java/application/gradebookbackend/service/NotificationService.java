package application.gradebookbackend.service;

import application.gradebookbackend.domain.*;
import application.gradebookbackend.dto.NotificationResponse;
import application.gradebookbackend.exception.ResourceNotFoundException;
import application.gradebookbackend.repository.AppUserRepository;
import application.gradebookbackend.repository.EnrollmentRepository;
import application.gradebookbackend.repository.NotificationRepository;
import application.gradebookbackend.repository.ParentRepository;
import application.gradebookbackend.repository.StudentRepository;
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
    private final StudentRepository studentRepository;

    public NotificationService(NotificationRepository notificationRepository,
                                EnrollmentRepository enrollmentRepository,
                                AppUserRepository appUserRepository,
                                ParentRepository parentRepository,
                                StudentRepository studentRepository) {
        this.notificationRepository = notificationRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.appUserRepository = appUserRepository;
        this.parentRepository = parentRepository;
        this.studentRepository = studentRepository;
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
    public void notifyParentsOfRemark(Student student, Remark remark) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentIdWithParent(student.getId());

        String studentName = student.getUser().getFirstName() + " " + student.getUser().getLastName();
        String dateStr = remark.getDate().toString();
        String message = "Нова забележка за " + studentName + " на " + dateStr + ": " + remark.getContent();

        for (Enrollment enrollment : enrollments) {
            Notification notification = new Notification();
            notification.setParent(enrollment.getParent());
            notification.setType(NotificationType.NEW_REMARK);
            notification.setMessage(message);
            notification.setSourceId(remark.getId());
            notification.setSourceType(SourceType.REMARK);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void notifyParentsOfPraise(Student student, Praise praise) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentIdWithParent(student.getId());

        String studentName = student.getUser().getFirstName() + " " + student.getUser().getLastName();
        String dateStr = praise.getDate().toString();
        String message = "Нова похвала за " + studentName + " на " + dateStr + ": " + praise.getContent();

        for (Enrollment enrollment : enrollments) {
            Notification notification = new Notification();
            notification.setParent(enrollment.getParent());
            notification.setType(NotificationType.NEW_PRAISE);
            notification.setMessage(message);
            notification.setSourceId(praise.getId());
            notification.setSourceType(SourceType.PRAISE);
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

    @Transactional
    public void notifyStudentOfGrade(Student student, Grade grade) {
        String subjectLabel = subjectLabel(grade.getSubject());
        String valueStr = grade.getValue().stripTrailingZeros().toPlainString();
        String message = "Получихте нова оценка по " + subjectLabel + ": " + valueStr;

        Notification notification = new Notification();
        notification.setStudent(student);
        notification.setType(NotificationType.NEW_GRADE);
        notification.setMessage(message);
        if (grade.getId() != null) {
            notification.setSourceId(grade.getId());
        }
        notification.setSourceType(SourceType.GRADE);
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getNotificationsForStudent(String externalUid) {
        Student student = findStudentByExternalUid(externalUid);
        return notificationRepository.findByStudentIdOrderByCreatedAtDesc(student.getId())
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }

    public long getUnreadCountForStudent(String externalUid) {
        Student student = findStudentByExternalUid(externalUid);
        return notificationRepository.countByStudentIdAndIsReadFalse(student.getId());
    }

    @Transactional
    public void markAllReadForStudent(String externalUid) {
        Student student = findStudentByExternalUid(externalUid);
        notificationRepository.markAllReadByStudentId(student.getId());
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

    private Student findStudentByExternalUid(String externalUid) {
        AppUser user = appUserRepository.findByExternalUid(externalUid)
                .orElseThrow(() -> new ResourceNotFoundException("AppUser", externalUid));
        return studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", user.getId()));
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
