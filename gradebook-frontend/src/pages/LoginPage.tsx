import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Alert, Button, TextField } from '@mui/material'
import { supabase } from '../lib/supabaseClient'
import { PrincepsLogo } from '@/components/PrincepsLogo/PrincepsLogo'
import styles from './LoginPage.module.scss'

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
        PRINCIPAL: '/principal',
      }
      navigate(homeByRole[payload.app_role] ?? '/admin')
    }

    setLoading(false)
  }

  return (
    <div className={styles.page}>
      {/* Left — brand panel */}
      <div className={styles.brand}>
        <div className={styles.brandInner}>
          <div className={styles.logo}>
            <PrincepsLogo size="lg" subtitle variant="light" />
          </div>
          <p className={styles.brandTagline}>
            Български език и литература
          </p>
          <div className={styles.brandOrnament} />
        </div>
      </div>

      {/* Right — form panel */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <Link to="/" className={styles.backLink}>
            ← Обратно към сайта
          </Link>
          <h1 className={styles.formTitle}>Добре дошли</h1>
          <p className={styles.formSub}>Влезте в своя дневник</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Имейл</label>
              <TextField
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                fullWidth
                size="small"
                placeholder="вашият@имейл.com"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Парола</label>
              <TextField
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                fullWidth
                size="small"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <Alert severity="error" sx={{ borderRadius: '6px', fontSize: '13px' }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              className={styles.submitBtn}
            >
              {loading ? 'Влизане…' : 'Вход'}
            </Button>

            <Link to="/forgot-password" className={styles.forgotLink}>
              Забравена парола?
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
