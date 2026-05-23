package application.gradebookbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;

public record UpdatePraiseRequest(
        @NotNull @PastOrPresent LocalDate date,
        @NotBlank String content
) {}
