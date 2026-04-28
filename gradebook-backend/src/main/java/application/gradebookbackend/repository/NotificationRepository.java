package application.gradebookbackend.repository;

import application.gradebookbackend.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByParentIdOrderByCreatedAtDesc(UUID parentId);

    long countByParentIdAndIsReadFalse(UUID parentId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.parent.id = :parentId AND n.isRead = false")
    void markAllReadByParentId(@Param("parentId") UUID parentId);
}
