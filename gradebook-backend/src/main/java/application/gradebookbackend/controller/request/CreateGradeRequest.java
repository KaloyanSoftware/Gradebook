package application.gradebookbackend.controller.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateGradeRequest(
        @NotNull UUID studentId,
        @PastOrPresent LocalDate date,
        String subject,
        @NotNull
        @DecimalMin(value = "2.0")
        @DecimalMax(value = "6.0")
        BigDecimal value,
        String comment
) {
}
