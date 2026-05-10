import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const homeByRole: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  PARENT: '/parent/dashboard',
  STUDENT: '/student/dashboard',
  PRINCIPAL: '/principal/dashboard',
}

export function AuthCallbackPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate(homeByRole[user.role] ?? '/login', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }
  }, [loading, user, navigate])

  return <div style={{ textAlign: 'center', padding: '2rem' }}>Зареждане…</div>
}
