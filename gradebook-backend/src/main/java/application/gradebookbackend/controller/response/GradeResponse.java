package application.gradebookbackend.controller.response;

import application.gradebookbackend.domain.Grade;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record GradeResponse(
        UUID id,
        String subject,
        LocalDate date,
        BigDecimal value,
        String comment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static GradeResponse from(final Grade grade){
        return new GradeResponse(grade.getId(), grade.getSubject().name(),
                grade.getDate(), grade.getValue(), grade.getComment(), grade.getCreatedAt(), grade.getUpdatedAt());
    }
}

