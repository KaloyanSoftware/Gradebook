package application.gradebookbackend.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class Enrollment {
    private UUID id;
    private Parent parent;
    private Student student;
    private LocalDateTime linkedAt;
}
