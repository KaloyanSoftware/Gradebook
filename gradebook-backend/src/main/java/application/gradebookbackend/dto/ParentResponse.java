package application.gradebookbackend.dto;

import application.gradebookbackend.domain.Parent;

import java.time.LocalDateTime;
import java.util.UUID;

public class ParentResponse {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDateTime createdAt;
    private boolean active;

    private ParentResponse(UUID id, String firstName, String lastName, String email, LocalDateTime createdAt, boolean active) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.createdAt = createdAt;
        this.active = active;
    }

    public static ParentResponse from(Parent parent) {
        return new ParentResponse(
                parent.getId(),
                parent.getUser().getFirstName(),
                parent.getUser().getLastName(),
                parent.getUser().getEmail(),
                parent.getUser().getCreatedAt(),
                parent.getUser().isActive()
        );
    }

    public UUID getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public boolean isActive() { return active; }
}
