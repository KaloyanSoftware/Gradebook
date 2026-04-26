import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { supabase } from '../lib/supabaseClient'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const redirectTo = `${window.location.origin}/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Забравена парола
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Въведете имейла си и ще получите линк за нулиране на паролата.
        </Typography>

        {sent ? (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              Изпратихме линк на <strong>{email}</strong>. Проверете пощата си.
            </Alert>
            <Button component={Link} to="/login" fullWidth variant="outlined">
              Обратно към вход
            </Button>
          </>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Имейл"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
              size="small"
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" disabled={loading} fullWidth>
              {loading ? 'Изпращане…' : 'Изпрати линк'}
            </Button>
            <Button component={Link} to="/login" variant="text" fullWidth>
              Обратно към вход
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
