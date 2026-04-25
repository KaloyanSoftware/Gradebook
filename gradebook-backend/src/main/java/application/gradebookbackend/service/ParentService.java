package application.gradebookbackend.service;

import application.gradebookbackend.domain.AppUser;
import application.gradebookbackend.domain.Parent;
import application.gradebookbackend.domain.Role;
import application.gradebookbackend.dto.CreateParentRequest;
import application.gradebookbackend.dto.ParentResponse;
import application.gradebookbackend.exception.DuplicateEmailException;
import application.gradebookbackend.repository.AppUserRepository;
import application.gradebookbackend.repository.ParentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ParentService {

    private final AppUserRepository appUserRepository;
    private final ParentRepository parentRepository;

    public ParentService(AppUserRepository appUserRepository, ParentRepository parentRepository) {
        this.appUserRepository = appUserRepository;
        this.parentRepository = parentRepository;
    }

    @Transactional
    public ParentResponse createParent(CreateParentRequest request) {
        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        AppUser user = new AppUser();
        // Temporary placeholder — will be replaced with the Supabase user ID once auth is integrated
        user.setExternalUid(UUID.randomUUID().toString());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(Role.PARENT);
        AppUser savedUser = appUserRepository.save(user);

        Parent parent = new Parent();
        parent.setUser(savedUser);
        parentRepository.save(parent);

        return ParentResponse.from(savedUser);
    }
}
