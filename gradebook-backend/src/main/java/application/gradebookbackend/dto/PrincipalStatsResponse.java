package application.gradebookbackend.dto;

import java.util.UUID;

public record PrincipalStatsResponse(
        long totalTeachers,
        long totalStudents,
        long totalParents,
        long totalGradesRecorded,
        long totalAbsencesRecorded,
        double schoolAverageGrade,
        double averageAbsencesPerStudent,
        TeacherStat mostActiveTeacher,
        TeacherStat leastActiveTeacher
) {
    public record TeacherStat(
            UUID teacherId,
            String teacherName,
            long gradesRecorded,
            long absencesRecorded
    ) {}
}
