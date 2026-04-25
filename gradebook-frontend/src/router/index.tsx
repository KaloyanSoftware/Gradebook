import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/layout/AdminLayout/AdminLayout'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage/AdminDashboardPage'
import { CreateParentPage } from '@/features/parents/pages/CreateParentPage/CreateParentPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'parents/new', element: <CreateParentPage /> },
    ],
  },
])
