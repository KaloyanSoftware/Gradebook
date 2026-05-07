package application.gradebookbackend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TeacherActivityResponse(
        List<GradeActivityItem> grades,
        List<AbsenceActivityItem> absences
) {
    public record GradeActivityItem(
            UUID gradeId,
            String studentName,
            String subject,
            BigDecimal value,
            LocalDate date,
            LocalDateTime createdAt
    ) {}

    public record AbsenceActivityItem(
            UUID absenceId,
            String studentName,
            LocalDate date,
            String reason,
            LocalDateTime createdAt
    ) {}
}
