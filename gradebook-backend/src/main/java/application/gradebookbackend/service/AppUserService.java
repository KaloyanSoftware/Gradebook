package application.gradebookbackend.service;

import application.gradebookbackend.domain.AppUser;
import application.gradebookbackend.repository.AppUserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public Optional<AppUser> findByExternalUid(String externalUid) {
        return appUserRepository.findByExternalUid(externalUid);
    }

    public boolean isEmailTakenByOtherUser(String email, String currentExternalUid) {
        return appUserRepository.findByEmail(email)
                .filter(u -> !u.getExternalUid().equals(currentExternalUid))
                .isPresent();
    }
}
