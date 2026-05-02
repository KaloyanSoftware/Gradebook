package application.gradebookbackend.dto;

import java.util.List;

public record DashboardResponse(
        long totalStudents,
        long totalParents,
        List<RecentGradeActivity> recentGrades,
        List<RecentAbsenceActivity> recentAbsences
) {}
