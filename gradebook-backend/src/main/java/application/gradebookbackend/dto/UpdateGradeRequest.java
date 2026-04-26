package application.gradebookbackend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateGradeRequest(
        @NotNull @PastOrPresent LocalDate date,
        @NotBlank String subject,
        @NotNull @DecimalMin("2.00") @DecimalMax("6.00") BigDecimal value,
        String comment
) {}
