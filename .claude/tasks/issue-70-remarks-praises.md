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

- [ ] SQL migration — `praises` table with RLS policies
- [ ] `Praise` entity
- [ ] `PraiseResponse`, `CreatePraiseRequest`, `UpdatePraiseRequest` DTOs
- [ ] `PraiseRepository`
- [ ] `PraiseService`
- [ ] `PraiseController` — CRUD under `/admin/praises`
- [ ] `StudentViewService.getMyPraises()` + `GET /student/me/praises` endpoint
- [ ] `ParentViewService.getMyChildPraises()` + `GET /parent/me/children/{studentId}/praises` endpoint
