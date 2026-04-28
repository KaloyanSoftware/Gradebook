package application.gradebookbackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;
import java.util.UUID;

public record CreateAbsenceRequest(
        @NotNull UUID studentId,
        @NotNull @PastOrPresent LocalDate date,
        String reason
) {}
