package application.gradebookbackend.dto;

import application.gradebookbackend.domain.Notification;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String type,
        String message,
        boolean isRead,
        UUID sourceId,
        String sourceType,
        LocalDateTime createdAt
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getType().name(),
                n.getMessage(),
                n.isRead(),
                n.getSourceId(),
                n.getSourceType().name(),
                n.getCreatedAt()
        );
    }
}
