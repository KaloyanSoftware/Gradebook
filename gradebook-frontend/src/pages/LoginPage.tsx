import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { supabase } from '../lib/supabaseClient'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      const token = data.session?.access_token ?? ''
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : {}
      const homeByRole: Record<string, string> = {
        ADMIN: '/admin',
        PARENT: '/parent',
        STUDENT: '/student',
      }
      navigate(homeByRole[payload.app_role] ?? '/admin')
    }

    setLoading(false)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            size="small"
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" disabled={loading} fullWidth>
            {loading ? 'Влизане…' : 'Вход'}
          </Button>
          <Button component={Link} to="/forgot-password" variant="text" fullWidth size="small">
            Забравена парола?
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
