package application.gradebookbackend.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Student {
    private UUID id;
    private AppUser user;
    private LocalDateTime enrolledAt;
    private List<Grade> grades = new ArrayList<>();
    private List<Absence> absences = new ArrayList<>();
}
