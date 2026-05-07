package application.gradebookbackend.exception;

public class TeacherHasActivityException extends RuntimeException {
    public TeacherHasActivityException() {
        super("Teacher has existing grades or absences and cannot be deleted. Block them instead.");
    }
}
