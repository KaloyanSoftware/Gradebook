package application.gradebookbackend.controller;

import application.gradebookbackend.domain.AppUser;
import application.gradebookbackend.dto.AppUserDto;
import application.gradebookbackend.service.AppUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserService appUserService;

    public AuthController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @GetMapping("/me")
    public ResponseEntity<AppUserDto> me(@AuthenticationPrincipal Jwt jwt) {
        String externalUid = jwt.getSubject();

        return appUserService.findByExternalUid(externalUid)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private AppUserDto toDto(AppUser user) {
        return new AppUserDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole()
        );
    }
}
