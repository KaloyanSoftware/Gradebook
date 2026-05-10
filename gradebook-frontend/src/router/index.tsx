import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage/LandingPage'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage/AuthCallbackPage'
import { AdminLayout } from '@/layout/AdminLayout/AdminLayout'
import { UserLayout } from '@/layout/UserLayout/UserLayout'
import { PrincipalLayout } from '@/layout/PrincipalLayout/PrincipalLayout'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage/AdminDashboardPage'
import { ParentsListPage } from '@/features/parents/pages/ParentsListPage/ParentsListPage'
import { StudentsListPage } from '@/features/students/pages/StudentsListPage/StudentsListPage'
import { AddGradePage } from '@/features/grades/pages/AddGradePage/AddGradePage'
import { LoginPage } from '@/pages/LoginPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { SettingsPage } from '@/pages/SettingsPage/SettingsPage'
import { ParentDashboardPage } from '@/pages/ParentDashboardPage/ParentDashboardPage'
import { StudentDashboardPage } from '@/pages/StudentDashboardPage/StudentDashboardPage'
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage/NotificationsPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PrincipalDashboardPage } from '@/features/principal/pages/PrincipalDashboardPage/PrincipalDashboardPage'
import { TeachersPage } from '@/features/principal/pages/TeachersPage/TeachersPage'
import { TeacherActivityPage } from '@/features/principal/pages/TeacherActivityPage/TeacherActivityPage'
import { PrincipalStudentsPage } from '@/features/principal/pages/PrincipalStudentsPage/PrincipalStudentsPage'
import { PrincipalParentsPage } from '@/features/principal/pages/PrincipalParentsPage/PrincipalParentsPage'

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/auth/callback" element={<AuthCallbackPage />} />

    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="parents" element={<ParentsListPage />} />
      <Route path="students" element={<StudentsListPage />} />
      <Route path="grades/new" element={<AddGradePage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>

    <Route
      path="/parent"
      element={
        <ProtectedRoute allowedRoles={['PARENT']}>
          <UserLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<ParentDashboardPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>

    <Route
      path="/student"
      element={
        <ProtectedRoute allowedRoles={['STUDENT']}>
          <UserLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<StudentDashboardPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>

    <Route
      path="/principal"
      element={
        <ProtectedRoute allowedRoles={['PRINCIPAL']}>
          <PrincipalLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<PrincipalDashboardPage />} />
      <Route path="teachers" element={<TeachersPage />} />
      <Route path="teachers/:teacherId/activity" element={<TeacherActivityPage />} />
      <Route path="students" element={<PrincipalStudentsPage />} />
      <Route path="parents" element={<PrincipalParentsPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)
