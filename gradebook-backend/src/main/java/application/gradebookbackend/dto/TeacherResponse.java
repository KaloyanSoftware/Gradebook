package application.gradebookbackend.dto;

import application.gradebookbackend.domain.AppUser;

import java.util.UUID;

public record TeacherResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        boolean active
) {
    public static TeacherResponse from(AppUser user) {
        return new TeacherResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.isActive()
        );
    }
}
