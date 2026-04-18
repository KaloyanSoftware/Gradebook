package application.gradebookbackend.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class AppUser {
    private UUID id;
    private String externalUid;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private LocalDateTime createdAt;
}