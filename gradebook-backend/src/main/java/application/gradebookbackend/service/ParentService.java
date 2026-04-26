package application.gradebookbackend.service;

import application.gradebookbackend.client.SupabaseAdminClient;
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

@Service
public class ParentService {

    private final AppUserRepository appUserRepository;
    private final ParentRepository parentRepository;
    private final SupabaseAdminClient supabaseAdminClient;

    public ParentService(AppUserRepository appUserRepository, ParentRepository parentRepository, SupabaseAdminClient supabaseAdminClient) {
        this.appUserRepository = appUserRepository;
        this.parentRepository = parentRepository;
        this.supabaseAdminClient = supabaseAdminClient;
    }

    @Transactional
    public ParentResponse createParent(CreateParentRequest request) {
        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        String authUid = supabaseAdminClient.createAuthUser(request.getEmail(), request.getPassword());

        try {
            AppUser user = new AppUser();
            user.setExternalUid(authUid);
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setRole(Role.PARENT);
            AppUser savedUser = appUserRepository.save(user);

            Parent parent = new Parent();
            parent.setUser(savedUser);
            Parent savedParent = parentRepository.save(parent);

            return ParentResponse.from(savedParent);
        } catch (Exception e) {
            supabaseAdminClient.deleteAuthUser(authUid);
            throw e;
        }
    }

    public List<ParentResponse> listParents() {
        return parentRepository.findAll().stream()
                .map(ParentResponse::from)
                .toList();
    }
}
