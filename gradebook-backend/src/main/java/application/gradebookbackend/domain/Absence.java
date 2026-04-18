package application.gradebookbackend.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class Absence {
    private UUID id;
    private LocalDate date;
    private String reason;
    private LocalDateTime createdAt;
}
