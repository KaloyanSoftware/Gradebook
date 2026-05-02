package application.gradebookbackend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record RecentAbsenceActivity(
        UUID absenceId,
        LocalDate date,
        String reason,
        UUID studentId,
        String studentName,
        LocalDateTime createdAt
) {}
