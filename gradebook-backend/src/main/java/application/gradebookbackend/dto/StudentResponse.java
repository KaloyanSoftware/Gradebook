package application.gradebookbackend.dto;

import application.gradebookbackend.domain.Student;

import java.time.LocalDateTime;
import java.util.UUID;

public class StudentResponse {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDateTime enrolledAt;

    private StudentResponse(UUID id, String firstName, String lastName, String email, LocalDateTime enrolledAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.enrolledAt = enrolledAt;
    }

    public static StudentResponse from(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getUser().getFirstName(),
                student.getUser().getLastName(),
                student.getUser().getEmail(),
                student.getEnrolledAt()
        );
    }

    public UUID getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public LocalDateTime getEnrolledAt() { return enrolledAt; }
}
