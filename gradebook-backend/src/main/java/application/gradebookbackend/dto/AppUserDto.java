package application.gradebookbackend.dto;

import application.gradebookbackend.domain.Role;

import java.util.UUID;

public record AppUserDto(
        UUID id,
        String email,
        String firstName,
        String lastName,
        Role role
) {}
