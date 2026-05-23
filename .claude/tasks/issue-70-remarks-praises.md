# Task: CRUD Remarks & Praises + View as Student/Teacher

Issue: #70 — CRUD remarks (забележки) and praises (похвали) for a student as a teacher; view as student/teacher

## Remarks (забележки)

- [x] SQL migration — `remarks` table with RLS policies (student sees own, parent sees linked children)
- [x] `Remark` entity — `student`, `date`, `content`, `createdAt`
- [x] `RemarkResponse` DTO with static `from()` factory
- [x] `CreateRemarkRequest` DTO — `studentId`, `date`, `content` (all validated)
- [x] `UpdateRemarkRequest` DTO — `date`, `content` (all validated)
- [x] `RemarkRepository` — `findByStudentIdOrderByDateDesc`
- [x] `RemarkService` — `listRemarksForStudent`, `createRemark`, `updateRemark`, `deleteRemark`
- [x] `RemarkController` — `GET /admin/remarks/student/{studentId}`, `POST /admin/remarks`, `PUT /admin/remarks/{id}`, `DELETE /admin/remarks/{id}` — `ADMIN` role only
- [x] `StudentViewService.getMyRemarks()` + `GET /student/me/remarks` endpoint
- [x] `ParentViewService.getMyChildRemarks()` + `GET /parent/me/children/{studentId}/remarks` endpoint

## Praises (похвали)

- [x] SQL migration — `praises` table with RLS policies (student sees own, parent sees linked children)
- [x] `Praise` entity — `student`, `date`, `content`, `createdAt`
- [x] `PraiseResponse`, `CreatePraiseRequest`, `UpdatePraiseRequest` DTOs
- [x] `PraiseRepository` — `findByStudentIdOrderByDateDesc`
- [x] `PraiseService` — `listPraisesForStudent`, `createPraise`, `updatePraise`, `deletePraise`
- [x] `PraiseController` — CRUD under `/admin/praises`; GET served via `StudentController`
- [x] `StudentViewService.getMyPraises()` + `GET /student/me/praises` endpoint
- [x] `ParentViewService.getMyChildPraises()` + `GET /parent/me/children/{studentId}/praises` endpoint
- [x] Frontend `features/praises/` — types, api, hooks, PraisesPanel (green palette, inline CRUD)
- [x] `StudentGradesPanel` — PraisesPanel wired in after RemarksPanel
- [x] Student gradebook page — похвали section + stats bar count
- [x] Parent gradebook page — похвали section + stats bar count
