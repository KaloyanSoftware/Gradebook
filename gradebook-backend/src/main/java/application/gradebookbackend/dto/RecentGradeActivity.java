package application.gradebookbackend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record RecentGradeActivity(
        UUID gradeId,
        String subject,
        BigDecimal value,
        LocalDate date,
        UUID studentId,
        String studentName,
        LocalDateTime createdAt
) {}
