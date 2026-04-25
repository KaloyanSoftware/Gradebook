package application.gradebookbackend.service;

import application.gradebookbackend.domain.AppUser;
import application.gradebookbackend.domain.Grade;
import application.gradebookbackend.domain.Student;
import application.gradebookbackend.domain.Subject;
import application.gradebookbackend.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GradeServiceUnitTest {

    @Mock
    private StudentRepository studentRepository;

    private GradeService gradeService;

    @BeforeEach
    void setUp() {
        gradeService = new GradeService(studentRepository);
    }

    @Test
    void shouldCreateGradeSuccessfully() {
        // Arrange
        UUID studentId = UUID.randomUUID();
        UUID createdById = UUID.randomUUID();
        LocalDate gradeDate = LocalDate.of(2026, 4, 25);
        Subject subject = Subject.MATH;
        BigDecimal value = new BigDecimal("4.5");
        String comment = "Good performance";

        Student student = createTestStudent(studentId);
        AppUser createdBy = createTestAppUser(createdById);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(studentRepository.save(student)).thenReturn(student);

        // Act
        Grade createdGrade = gradeService.createGrade(studentId, gradeDate, subject, value, comment, createdBy);

        // Assert
        assertNotNull(createdGrade);
        assertEquals(studentId, createdGrade.getStudentId());
        assertEquals(gradeDate, createdGrade.getDate());
        assertEquals(subject, createdGrade.getSubject());
        assertEquals(value, createdGrade.getValue());
        assertEquals(comment, createdGrade.getComment());
        assertEquals(createdBy, createdGrade.getCreatedBy());
    }

    @Test
    void shouldThrowExceptionWhenStudentNotFound() {
        // Arrange
        UUID studentId = UUID.randomUUID();
        LocalDate gradeDate = LocalDate.of(2026, 4, 25);
        Subject subject = Subject.MATH;
        BigDecimal value = new BigDecimal("4.5");
        AppUser createdBy = createTestAppUser(UUID.randomUUID());

        when(studentRepository.findById(studentId)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> gradeService.createGrade(studentId, gradeDate, subject, value, null, createdBy)
        );

        assertEquals("Student not found with id: " + studentId, exception.getMessage());
    }

    @Test
    void shouldAddGradeToStudentList() {
        // Arrange
        UUID studentId = UUID.randomUUID();
        LocalDate gradeDate = LocalDate.of(2026, 4, 25);
        Subject subject = Subject.ENGLISH;
        BigDecimal value = new BigDecimal("3.75");
        Student student = createTestStudent(studentId);
        AppUser createdBy = createTestAppUser(UUID.randomUUID());

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(studentRepository.save(student)).thenReturn(student);

        // Act
        Grade createdGrade = gradeService.createGrade(studentId, gradeDate, subject, value, null, createdBy);

        // Assert
        assertTrue(student.getGrades().contains(createdGrade));
        assertEquals(1, student.getGrades().size());
    }

    @Test
    void shouldPersistStudentWithGrade() {
        // Arrange
        UUID studentId = UUID.randomUUID();
        LocalDate gradeDate = LocalDate.of(2026, 4, 25);
        Subject subject = Subject.SCIENCE;
        BigDecimal value = new BigDecimal("5");
        Student student = createTestStudent(studentId);
        AppUser createdBy = createTestAppUser(UUID.randomUUID());

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(studentRepository.save(student)).thenReturn(student);

        // Act
        gradeService.createGrade(studentId, gradeDate, subject, value, null, createdBy);

        // Assert
        ArgumentCaptor<Student> studentCaptor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository, times(1)).save(studentCaptor.capture());

        Student savedStudent = studentCaptor.getValue();
        assertEquals(student, savedStudent);
        assertEquals(1, savedStudent.getGrades().size());
    }

    @Test
    void shouldSetAllGradePropertiesCorrectly() {
        // Arrange
        UUID studentId = UUID.randomUUID();
        UUID createdById = UUID.randomUUID();
        LocalDate gradeDate = LocalDate.of(2026, 3, 15);
        Subject subject = Subject.HISTORY;
        BigDecimal value = new BigDecimal("4.0");
        String comment = "Excellent work on the essay";

        Student student = createTestStudent(studentId);
        AppUser createdBy = createTestAppUser(createdById);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(studentRepository.save(student)).thenReturn(student);

        // Act
        Grade createdGrade = gradeService.createGrade(studentId, gradeDate, subject, value, comment, createdBy);

        // Assert
        assertEquals(studentId, createdGrade.getStudentId());
        assertEquals(gradeDate, createdGrade.getDate());
        assertEquals(subject, createdGrade.getSubject());
        assertEquals(value, createdGrade.getValue());
        assertEquals(comment, createdGrade.getComment());
        assertEquals(createdBy, createdGrade.getCreatedBy());
    }

    @Test
    void shouldHandleNullComment() {
        // Arrange
        UUID studentId = UUID.randomUUID();
        LocalDate gradeDate = LocalDate.of(2026, 4, 25);
        Subject subject = Subject.PE;
        BigDecimal value = new BigDecimal("3.5");
        Student student = createTestStudent(studentId);
        AppUser createdBy = createTestAppUser(UUID.randomUUID());

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(studentRepository.save(student)).thenReturn(student);

        // Act
        Grade createdGrade = gradeService.createGrade(studentId, gradeDate, subject, value, null, createdBy);

        // Assert
        assertNull(createdGrade.getComment());
    }

    @Test
    void shouldCallRepositoryFindByIdWithCorrectId() {
        // Arrange
        UUID studentId = UUID.randomUUID();
        LocalDate gradeDate = LocalDate.of(2026, 4, 25);
        Subject subject = Subject.MATH;
        BigDecimal value = new BigDecimal("4.5");
        Student student = createTestStudent(studentId);
        AppUser createdBy = createTestAppUser(UUID.randomUUID());

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(studentRepository.save(student)).thenReturn(student);

        // Act
        gradeService.createGrade(studentId, gradeDate, subject, value, null, createdBy);

        // Assert
        verify(studentRepository, times(1)).findById(studentId);
    }

    @Test
    void shouldAddMultipleGradesToStudent() {
        // Arrange
        UUID studentId = UUID.randomUUID();
        Student student = createTestStudent(studentId);
        AppUser createdBy = createTestAppUser(UUID.randomUUID());

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(studentRepository.save(student)).thenReturn(student);

        // Act
        Grade grade1 = gradeService.createGrade(studentId, LocalDate.of(2026, 1, 15), Subject.MATH, new BigDecimal("4.5"), null, createdBy);
        Grade grade2 = gradeService.createGrade(studentId, LocalDate.of(2026, 2, 20), Subject.ENGLISH, new BigDecimal("3.75"), null, createdBy);

        // Assert
        assertEquals(2, student.getGrades().size());
        assertTrue(student.getGrades().contains(grade1));
        assertTrue(student.getGrades().contains(grade2));
    }

    // Helper methods
    private Student createTestStudent(UUID studentId) {
        Student student = new Student();
        student.setId(studentId);
        return student;
    }

    private AppUser createTestAppUser(UUID userId) {
        AppUser appUser = new AppUser();
        appUser.setId(userId);
        appUser.setEmail("test@example.com");
        appUser.setFirstName("Test");
        appUser.setLastName("User");
        return appUser;
    }
}

