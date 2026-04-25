import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/layout/AdminLayout/AdminLayout'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage/AdminDashboardPage'
import { CreateParentPage } from '@/features/parents/pages/CreateParentPage/CreateParentPage'
import { AddGradePage } from '@/features/grades/pages/AddGradePage/AddGradePage'
import { LoginPage } from '@/pages/LoginPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="parents/new" element={<CreateParentPage />} />
      <Route path="grades/new" element={<AddGradePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
)
