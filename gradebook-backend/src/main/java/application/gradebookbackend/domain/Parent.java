package application.gradebookbackend.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Parent {
    private UUID id;
    private AppUser user;
    private List<Enrollment> enrollments = new ArrayList<>();
    private List<Notification> notifications = new ArrayList<>();
}
