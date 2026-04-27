package application.gradebookbackend.dto;

import application.gradebookbackend.domain.Student;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class StudentRosterResponse {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDateTime enrolledAt;
    private List<String> parents;
    private boolean active;

    private StudentRosterResponse(UUID id, String firstName, String lastName,
                                  String email, LocalDateTime enrolledAt, List<String> parents, boolean active) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.enrolledAt = enrolledAt;
        this.parents = parents;
        this.active = active;
    }

    public static StudentRosterResponse from(Student student, List<String> parentNames) {
        return new StudentRosterResponse(
                student.getId(),
                student.getUser().getFirstName(),
                student.getUser().getLastName(),
                student.getUser().getEmail(),
                student.getEnrolledAt(),
                parentNames,
                student.getUser().isActive()
        );
    }

    public UUID getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public LocalDateTime getEnrolledAt() { return enrolledAt; }
    public List<String> getParents() { return parents; }
    public boolean isActive() { return active; }
}
