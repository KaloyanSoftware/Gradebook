package application.gradebookbackend.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class Grade {
    private UUID id;
    private LocalDate date;
    private String subject;
    private BigDecimal value;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
