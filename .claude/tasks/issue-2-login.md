# Task: Issue #2 — Login (Backend + Frontend)

## Backend
- [x] `config/SecurityConfig.java` — Spring Security + OAuth2 Resource Server
- [x] `dto/AppUserDto.java` — response DTO for /api/auth/me
- [x] `repository/AppUserRepository.java` — findByExternalUid
- [x] `service/AppUserService.java` — business logic
- [x] `controller/AuthController.java` — GET /api/auth/me

## Frontend
- [x] Install `@supabase/supabase-js` + `react-router-dom`
- [x] `src/lib/supabaseClient.ts`
- [x] `src/types/index.ts`
- [x] `src/context/AuthContext.tsx`
- [x] `src/services/api.ts`
- [x] `src/components/ProtectedRoute.tsx`
- [x] `src/pages/LoginPage.tsx`
- [x] `src/App.tsx` — routing setup
