package application.gradebookbackend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateGradeRequest(
        @NotNull UUID studentId,
        @NotNull @PastOrPresent LocalDate date,
        @NotNull String subject,
        @NotNull @DecimalMin("2.0") @DecimalMax("6.0") BigDecimal value,
        String comment
) {
}
