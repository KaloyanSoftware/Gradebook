package application.gradebookbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;
import java.util.UUID;

public record CreatePraiseRequest(
        @NotNull UUID studentId,
        @NotNull @PastOrPresent LocalDate date,
        @NotBlank String content
) {}
