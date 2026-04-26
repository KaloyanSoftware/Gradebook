import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { supabase } from '../lib/supabaseClient'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Паролите не съвпадат.')
      return
    }
    if (password.length < 6) {
      setError('Паролата трябва да е поне 6 символа.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
    } else {
      await supabase.auth.signOut()
      navigate('/login')
    }

    setLoading(false)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Нова парола
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Въведете и потвърдете новата си парола.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Нова парола"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Потвърди паролата"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            fullWidth
            size="small"
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" disabled={loading} fullWidth>
            {loading ? 'Запазване…' : 'Запази паролата'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
