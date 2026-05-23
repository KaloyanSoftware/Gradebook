package application.gradebookbackend.dto;

import application.gradebookbackend.domain.Remark;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record RemarkResponse(
        UUID id,
        UUID studentId,
        LocalDate date,
        String content,
        LocalDateTime createdAt
) {
    public static RemarkResponse from(Remark remark) {
        return new RemarkResponse(
                remark.getId(),
                remark.getStudent().getId(),
                remark.getDate(),
                remark.getContent(),
                remark.getCreatedAt()
        );
    }
}
