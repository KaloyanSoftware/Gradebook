package application.gradebookbackend.service;

import application.gradebookbackend.client.SupabaseAdminClient;
import application.gradebookbackend.domain.AppUser;
import application.gradebookbackend.domain.Role;
import application.gradebookbackend.dto.CreateTeacherRequest;
import application.gradebookbackend.dto.PrincipalStatsResponse;
import application.gradebookbackend.dto.TeacherActivityResponse;
import application.gradebookbackend.dto.TeacherResponse;
import application.gradebookbackend.exception.DuplicateEmailException;
import application.gradebookbackend.exception.ResourceNotFoundException;
import application.gradebookbackend.exception.TeacherHasActivityException;
import application.gradebookbackend.repository.AbsenceRepository;
import application.gradebookbackend.repository.AppUserRepository;
import application.gradebookbackend.repository.GradeRepository;
import application.gradebookbackend.repository.ParentRepository;
import application.gradebookbackend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class TeacherService {

    private final AppUserRepository appUserRepository;
    private final GradeRepository gradeRepository;
    private final AbsenceRepository absenceRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final SupabaseAdminClient supabaseAdminClient;

    public TeacherService(
            AppUserRepository appUserRepository,
            GradeRepository gradeRepository,
            AbsenceRepository absenceRepository,
            StudentRepository studentRepository,
            ParentRepository parentRepository,
            SupabaseAdminClient supabaseAdminClient) {
        this.appUserRepository = appUserRepository;
        this.gradeRepository = gradeRepository;
        this.absenceRepository = absenceRepository;
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
        this.supabaseAdminClient = supabaseAdminClient;
    }

    public List<TeacherResponse> listTeachers() {
        return appUserRepository.findByRole(Role.ADMIN).stream()
                .map(TeacherResponse::from)
                .toList();
    }

    @Transactional
    public TeacherResponse createTeacher(CreateTeacherRequest request) {
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
            user.setRole(Role.ADMIN);
            return TeacherResponse.from(appUserRepository.save(user));
        } catch (Exception e) {
            supabaseAdminClient.deleteAuthUser(authUid);
            throw e;
        }
    }

    @Transactional
    public void blockTeacher(UUID teacherId) {
        AppUser teacher = findTeacher(teacherId);
        teacher.setActive(false);
        appUserRepository.save(teacher);
        supabaseAdminClient.banUser(teacher.getExternalUid());
    }

    @Transactional
    public void unblockTeacher(UUID teacherId) {
        AppUser teacher = findTeacher(teacherId);
        teacher.setActive(true);
        appUserRepository.save(teacher);
        supabaseAdminClient.unbanUser(teacher.getExternalUid());
    }

    @Transactional
    public void deleteTeacher(UUID teacherId) {
        AppUser teacher = findTeacher(teacherId);

        if (gradeRepository.existsByCreatedById(teacherId) || absenceRepository.existsByCreatedById(teacherId)) {
            throw new TeacherHasActivityException();
        }

        supabaseAdminClient.deleteAuthUser(teacher.getExternalUid());
        appUserRepository.delete(teacher);
    }

    public TeacherActivityResponse getTeacherActivity(UUID teacherId) {
        findTeacher(teacherId);

        List<TeacherActivityResponse.GradeActivityItem> grades =
                gradeRepository.findByCreatedByIdOrderByCreatedAtDesc(teacherId).stream()
                        .map(g -> new TeacherActivityResponse.GradeActivityItem(
                                g.getId(),
                                g.getStudent().getUser().getFirstName() + " " + g.getStudent().getUser().getLastName(),
                                g.getSubject().name(),
                                g.getValue(),
                                g.getDate(),
                                g.getCreatedAt()
                        ))
                        .toList();

        List<TeacherActivityResponse.AbsenceActivityItem> absences =
                absenceRepository.findByCreatedByIdOrderByCreatedAtDesc(teacherId).stream()
                        .map(a -> new TeacherActivityResponse.AbsenceActivityItem(
                                a.getId(),
                                a.getStudent().getUser().getFirstName() + " " + a.getStudent().getUser().getLastName(),
                                a.getDate(),
                                a.getReason(),
                                a.getCreatedAt()
                        ))
                        .toList();

        return new TeacherActivityResponse(grades, absences);
    }

    public PrincipalStatsResponse getStats() {
        List<AppUser> teachers = appUserRepository.findByRole(Role.ADMIN);
        long totalStudents = studentRepository.count();
        long totalParents = parentRepository.count();
        long totalGrades = gradeRepository.count();
        long totalAbsences = absenceRepository.count();
        double avgGrade = gradeRepository.findSchoolAverageGrade().orElse(0.0);
        double avgAbsences = totalStudents > 0 ? (double) totalAbsences / totalStudents : 0.0;

        List<PrincipalStatsResponse.TeacherStat> stats = teachers.stream()
                .map(t -> new PrincipalStatsResponse.TeacherStat(
                        t.getId(),
                        t.getFirstName() + " " + t.getLastName(),
                        gradeRepository.countByCreatedById(t.getId()),
                        absenceRepository.countByCreatedById(t.getId())
                ))
                .sorted(Comparator.comparingLong(s -> -(s.gradesRecorded() + s.absencesRecorded())))
                .toList();

        PrincipalStatsResponse.TeacherStat most = stats.isEmpty() ? null : stats.get(0);
        PrincipalStatsResponse.TeacherStat least = stats.isEmpty() ? null : stats.get(stats.size() - 1);

        return new PrincipalStatsResponse(
                teachers.size(), totalStudents, totalParents,
                totalGrades, totalAbsences,
                Math.round(avgGrade * 100.0) / 100.0,
                Math.round(avgAbsences * 100.0) / 100.0,
                most, least
        );
    }

    private AppUser findTeacher(UUID teacherId) {
        return appUserRepository.findById(teacherId)
                .filter(u -> u.getRole() == Role.ADMIN)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", teacherId));
    }
}
