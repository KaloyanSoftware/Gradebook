import { useState } from 'react'
import { Alert, Button, TextField } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'
import styles from './SettingsPage.module.scss'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Администратор',
  PARENT: 'Родител',
  STUDENT: 'Ученик',
}

function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.[0] ?? ''
  const l = lastName?.[0] ?? ''
  return (f + l).toUpperCase() || '?'
}

export function SettingsPage() {
  const { session, user } = useAuth()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

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
      setSuccess(true)
      setPassword('')
      setConfirm('')
    }

    setLoading(false)
  }

  const fullName = user ? `${user.firstName} ${user.lastName}` : '—'
  const email = session?.user?.email ?? '—'
  const roleLabel = user ? (ROLE_LABELS[user.role] ?? user.role) : null

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Настройки</h1>

      {/* Profile card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon}><PersonIcon fontSize="small" /></span>
          <span className={styles.cardTitle}>Профил</span>
        </div>
        <div className={styles.profileBody}>
          <div className={styles.avatar}>
            {getInitials(user?.firstName, user?.lastName)}
          </div>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>{fullName}</p>
            <p className={styles.profileEmail}>{email}</p>
            {roleLabel && (
              <span className={styles.profileRoleBadge}>{roleLabel}</span>
            )}
          </div>
        </div>
      </div>

      {/* Password card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon}><LockOutlinedIcon fontSize="small" /></span>
          <span className={styles.cardTitle}>Сигурност</span>
        </div>
        <form className={styles.passwordBody} onSubmit={handlePasswordChange}>
          <p className={styles.helperText}>
            Задайте нова парола за вашия акаунт. Паролата трябва да е поне 6 символа.
          </p>
          <div className={styles.fields}>
            <TextField
              label="Нова парола"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Потвърди паролата"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              fullWidth
            />
          </div>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Паролата е променена успешно.</Alert>}
          <div className={styles.actions}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Запазване…' : 'Промени паролата'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
