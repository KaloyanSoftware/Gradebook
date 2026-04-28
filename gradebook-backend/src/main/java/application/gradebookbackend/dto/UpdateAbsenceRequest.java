package application.gradebookbackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;

public record UpdateAbsenceRequest(
        @NotNull @PastOrPresent LocalDate date,
        String reason
) {}
