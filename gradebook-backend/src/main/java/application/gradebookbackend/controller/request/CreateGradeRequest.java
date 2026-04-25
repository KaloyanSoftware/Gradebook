package application.gradebookbackend.controller.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateGradeRequest(
        UUID studentId,
        LocalDate date,
        String subject,
        BigDecimal value,
        String comment
) {
}
