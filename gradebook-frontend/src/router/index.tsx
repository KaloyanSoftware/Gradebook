import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/layout/AdminLayout/AdminLayout'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage/AdminDashboardPage'
import { ParentsListPage } from '@/features/parents/pages/ParentsListPage/ParentsListPage'
import { AddGradePage } from '@/features/grades/pages/AddGradePage/AddGradePage'

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/admin" replace />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="parents" element={<ParentsListPage />} />
      <Route path="grades/new" element={<AddGradePage />} />
    </Route>
  </Routes>
)
