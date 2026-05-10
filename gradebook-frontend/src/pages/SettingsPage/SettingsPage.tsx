import { useState } from 'react'
import { Alert, Button, TextField } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import axiosClient from '@/api/axiosClient'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'
import styles from './SettingsPage.module.scss'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Администратор',
  PARENT: 'Родител',
  STUDENT: 'Ученик',
  PRINCIPAL: 'Директор',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  const [emailCurrentPassword, setEmailCurrentPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)
  const [emailLoading, setEmailLoading] = useState(false)

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

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault()
    setEmailError(null)
    setEmailSuccess(null)

    const currentEmail = session?.user?.email
    if (!currentEmail) {
      setEmailError('Не може да се определи текущият имейл.')
      return
    }

    const trimmed = newEmail.trim()
    const trimmedConfirm = confirmEmail.trim()

    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailError('Невалиден имейл адрес.')
      return
    }
    if (trimmed !== trimmedConfirm) {
      setEmailError('Имейлите не съвпадат.')
      return
    }
    if (trimmed.toLowerCase() === currentEmail.toLowerCase()) {
      setEmailError('Новият имейл трябва да е различен от текущия.')
      return
    }
    if (!emailCurrentPassword) {
      setEmailError('Моля, въведете текущата си парола.')
      return
    }

    setEmailLoading(true)
    try {
      const { data } = await axiosClient.get<{ available: boolean }>('/api/auth/email-available', {
        params: { email: trimmed },
      })
      if (!data.available) {
        setEmailError('Този имейл вече е зает.')
        return
      }

      const { error: pwErr } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password: emailCurrentPassword,
      })
      if (pwErr) {
        setEmailError('Грешна текуща парола.')
        return
      }

      const { error: updateErr } = await supabase.auth.updateUser(
        { email: trimmed },
        { emailRedirectTo: `${window.location.origin}/auth/callback` }
      )
      if (updateErr) {
        setEmailError(updateErr.message)
        return
      }

      setEmailSuccess(
        `Изпратихме линк за потвърждение на ${trimmed}. Линкът е валиден 15 минути.`
      )
      setEmailCurrentPassword('')
      setNewEmail('')
      setConfirmEmail('')
    } finally {
      setEmailLoading(false)
    }
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

      {/* Email change card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon}><EmailOutlinedIcon fontSize="small" /></span>
          <span className={styles.cardTitle}>Промяна на имейл</span>
        </div>
        <form className={styles.passwordBody} onSubmit={handleEmailChange}>
          <p className={styles.helperText}>
            Ще изпратим линк за потвърждение на новия имейл. Линкът е валиден 15 минути.
          </p>
          <div className={styles.fields}>
            <TextField
              label="Текуща парола"
              type="password"
              value={emailCurrentPassword}
              onChange={e => setEmailCurrentPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Нов имейл"
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Потвърди новия имейл"
              type="email"
              value={confirmEmail}
              onChange={e => setConfirmEmail(e.target.value)}
              required
              fullWidth
            />
          </div>
          {emailError && <Alert severity="error">{emailError}</Alert>}
          {emailSuccess && <Alert severity="success">{emailSuccess}</Alert>}
          <div className={styles.actions}>
            <Button type="submit" variant="contained" disabled={emailLoading}>
              {emailLoading ? 'Изпращане…' : 'Промени имейла'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
