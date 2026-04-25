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

import java.util.List;
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

        // TODO: call Supabase Admin API here to create the auth user with request.getEmail()
        //   and request.getPassword(). On success, use the returned UID as externalUid below.
        AppUser user = new AppUser();
        user.setExternalUid(UUID.randomUUID().toString()); // placeholder until Supabase is integrated
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(Role.PARENT);
        AppUser savedUser = appUserRepository.save(user);

        Parent parent = new Parent();
        parent.setUser(savedUser);
        Parent savedParent = parentRepository.save(parent);

        return ParentResponse.from(savedParent);
    }

    public List<ParentResponse> listParents() {
        return parentRepository.findAll().stream()
                .map(ParentResponse::from)
                .toList();
    }
}
