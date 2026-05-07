package application.gradebookbackend.repository;

import application.gradebookbackend.domain.AppUser;
import application.gradebookbackend.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, UUID> {

    Optional<AppUser> findByExternalUid(String externalUid);

    boolean existsByEmail(String email);

    List<AppUser> findByRole(Role role);
}
