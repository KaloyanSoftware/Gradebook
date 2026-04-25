import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/layout/AdminLayout/AdminLayout'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage/AdminDashboardPage'
import { CreateParentPage } from '@/features/parents/pages/CreateParentPage/CreateParentPage'

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/admin" replace />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="parents/new" element={<CreateParentPage />} />
    </Route>
  </Routes>
)
