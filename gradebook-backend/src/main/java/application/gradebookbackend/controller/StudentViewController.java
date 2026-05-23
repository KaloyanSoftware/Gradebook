package application.gradebookbackend.controller;

import application.gradebookbackend.dto.AbsenceResponse;
import application.gradebookbackend.dto.GradeResponse;
import application.gradebookbackend.dto.NotificationResponse;
import application.gradebookbackend.dto.PraiseResponse;
import application.gradebookbackend.dto.RemarkResponse;
import application.gradebookbackend.service.NotificationService;
import application.gradebookbackend.service.StudentViewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/student/me")
@PreAuthorize("hasRole('STUDENT')")
public class StudentViewController {

    private final StudentViewService studentViewService;
    private final NotificationService notificationService;

    public StudentViewController(StudentViewService studentViewService,
                                 NotificationService notificationService) {
        this.studentViewService = studentViewService;
        this.notificationService = notificationService;
    }

    @GetMapping("/grades")
    public List<GradeResponse> getMyGrades(@AuthenticationPrincipal Jwt jwt) {
        return studentViewService.getMyGrades(jwt.getSubject());
    }

    @GetMapping("/absences")
    public List<AbsenceResponse> getMyAbsences(@AuthenticationPrincipal Jwt jwt) {
        return studentViewService.getMyAbsences(jwt.getSubject());
    }

    @GetMapping("/remarks")
    public List<RemarkResponse> getMyRemarks(@AuthenticationPrincipal Jwt jwt) {
        return studentViewService.getMyRemarks(jwt.getSubject());
    }

    @GetMapping("/praises")
    public List<PraiseResponse> getMyPraises(@AuthenticationPrincipal Jwt jwt) {
        return studentViewService.getMyPraises(jwt.getSubject());
    }

    @GetMapping("/notifications")
    public List<NotificationResponse> getMyNotifications(@AuthenticationPrincipal Jwt jwt) {
        return notificationService.getNotificationsForStudent(jwt.getSubject());
    }

    @GetMapping("/notifications/unread-count")
    public Map<String, Long> getUnreadCount(@AuthenticationPrincipal Jwt jwt) {
        long count = notificationService.getUnreadCountForStudent(jwt.getSubject());
        return Map.of("count", count);
    }

    @PatchMapping("/notifications/read-all")
    public ResponseEntity<Void> markAllRead(@AuthenticationPrincipal Jwt jwt) {
        notificationService.markAllReadForStudent(jwt.getSubject());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Void> markRead(@PathVariable UUID notificationId) {
        notificationService.markRead(notificationId);
        return ResponseEntity.noContent().build();
    }
}
