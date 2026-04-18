package application.gradebookbackend.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class Notification {
    private UUID id;
    private NotificationType type;
    private String message;
    private boolean isRead;
    private UUID sourceId;
    private SourceType sourceType;
    private LocalDateTime createdAt;
}
