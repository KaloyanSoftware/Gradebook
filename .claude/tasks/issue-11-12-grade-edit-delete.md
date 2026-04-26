# Task: Edit (#11) and Delete (#12) grade entries

## Backend

- [x] Add `UpdateGradeRequest` DTO
- [x] Add `updateGrade(UUID gradeId, UpdateGradeRequest)` to `GradeService`
- [x] Add `deleteGrade(UUID gradeId)` to `GradeService`
- [x] Add `PUT /admin/grades/{gradeId}` to `GradeController`
- [x] Add `DELETE /admin/grades/{gradeId}` to `GradeController`
- [x] Add `GET /admin/students/{studentId}/grades` to `StudentController`
- [x] Update `grades.http` test file with new endpoints
- [x] Fix `created_by NOT NULL` constraint — run `ALTER TABLE grades ALTER COLUMN created_by DROP NOT NULL` in DB

## Frontend

- [x] Update `grade.types.ts` — add `UpdateGradeRequest`, expand `GradeResponse`
- [x] Update `grades.api.ts` — add `getGradesByStudent`, `updateGrade`, `deleteGrade`
- [x] Update `useCreateGrade.ts` — accept `studentId`, invalidate `['grades', studentId]`
- [x] Confirm `useStudentGrades.ts` correct (existed, no change needed)
- [x] Confirm `useUpdateGrade.ts` correct (existed, no change needed)
- [x] Confirm `useDeleteGrade.ts` correct (existed, no change needed)
- [x] Create `GradePicker` component (colored circle buttons for grade values 2–6)
- [x] Add grade color variables to `_variables.scss`
- [x] Create `StudentGradesPanel` — inline panel with grade table, edit/delete/add using GradePicker
- [x] Update `StudentsListPage` — accordion expand/collapse per student row, renders `StudentGradesPanel`
