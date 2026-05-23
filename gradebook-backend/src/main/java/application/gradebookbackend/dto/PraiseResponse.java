package application.gradebookbackend.dto;

import application.gradebookbackend.domain.Praise;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record PraiseResponse(
        UUID id,
        UUID studentId,
        LocalDate date,
        String content,
        LocalDateTime createdAt
) {
    public static PraiseResponse from(Praise praise) {
        return new PraiseResponse(
                praise.getId(),
                praise.getStudent().getId(),
                praise.getDate(),
                praise.getContent(),
                praise.getCreatedAt()
        );
    }
}
