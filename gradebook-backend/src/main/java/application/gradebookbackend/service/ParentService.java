package application.gradebookbackend.service;

import application.gradebookbackend.client.SupabaseAdminClient;
import application.gradebookbackend.domain.AppUser;
import application.gradebookbackend.domain.Parent;
import application.gradebookbackend.domain.Role;
import application.gradebookbackend.dto.CreateParentRequest;
import application.gradebookbackend.dto.ParentResponse;
import application.gradebookbackend.exception.DuplicateEmailException;
import application.gradebookbackend.exception.ResourceNotFoundException;
import application.gradebookbackend.repository.AppUserRepository;
import application.gradebookbackend.repository.ParentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ParentService {

    private static final Logger log = LoggerFactory.getLogger(ParentService.class);

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

    @Transactional
    public void deactivateParent(UUID parentId) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", parentId));
        AppUser user = parent.getUser();
        user.setActive(false);
        appUserRepository.save(user);
        tryBanAuthUser(user.getExternalUid());
    }

    @Transactional
    public void activateParent(UUID parentId) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", parentId));
        AppUser user = parent.getUser();
        user.setActive(true);
        appUserRepository.save(user);
        tryUnbanAuthUser(user.getExternalUid());
    }

    @Transactional
    public void deleteParent(UUID parentId) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent", parentId));
        String authUid = parent.getUser().getExternalUid();
        AppUser user = parent.getUser();

        parentRepository.delete(parent);   // cascades enrollments + notifications
        appUserRepository.delete(user);
        tryDeleteAuthUser(authUid);
    }

    private void tryBanAuthUser(String uid) {
        if (uid == null || uid.isBlank()) return;
        try {
            supabaseAdminClient.banUser(uid);
        } catch (Exception e) {
            log.warn("Could not ban Supabase auth user {}: {}", uid, e.getMessage());
        }
    }

    private void tryUnbanAuthUser(String uid) {
        if (uid == null || uid.isBlank()) return;
        try {
            supabaseAdminClient.unbanUser(uid);
        } catch (Exception e) {
            log.warn("Could not unban Supabase auth user {}: {}", uid, e.getMessage());
        }
    }

    private void tryDeleteAuthUser(String uid) {
        if (uid == null || uid.isBlank()) return;
        try {
            supabaseAdminClient.deleteAuthUser(uid);
        } catch (Exception e) {
            log.warn("Could not delete Supabase auth user {}: {}", uid, e.getMessage());
        }
    }
}
