package application.gradebookbackend.dto;

import application.gradebookbackend.domain.Absence;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record AbsenceResponse(
        UUID id,
        LocalDate date,
        String reason,
        LocalDateTime createdAt
) {
    public static AbsenceResponse from(Absence absence) {
        return new AbsenceResponse(
                absence.getId(),
                absence.getDate(),
                absence.getReason(),
                absence.getCreatedAt()
        );
    }
}
