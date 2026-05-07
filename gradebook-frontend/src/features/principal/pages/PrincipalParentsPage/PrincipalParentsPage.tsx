import { CircularProgress, Typography } from '@mui/material'
import { usePrincipalParents } from '../../hooks/usePrincipalParents'
import styles from './PrincipalParentsPage.module.scss'

export const PrincipalParentsPage = () => {
  const { data: parents, isLoading } = usePrincipalParents()

  const initials = (f: string, l: string) => `${f.charAt(0)}${l.charAt(0)}`.toUpperCase()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography className={styles.title}>Родители</Typography>
      </div>

      {isLoading ? (
        <div className={styles.loading}><CircularProgress /></div>
      ) : !parents || parents.length === 0 ? (
        <div className={styles.empty}>Няма добавени родители все още.</div>
      ) : (
        <div className={styles.list}>
          {parents.map((parent) => (
            <div key={parent.id} className={styles.card}>
              <div className={styles.avatar}>{initials(parent.firstName, parent.lastName)}</div>
              <div className={styles.info}>
                <div className={styles.name}>{parent.firstName} {parent.lastName}</div>
                <div className={styles.email}>{parent.email}</div>
              </div>
              <span className={parent.active ? styles.badgeActive : styles.badgeBlocked}>
                {parent.active ? 'Активен' : 'Блокиран'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
