import { Typography } from '@mui/material'
import styles from './AdminDashboardPage.module.scss'

export const AdminDashboardPage = () => {
  return (
    <div className={styles.page}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Табло
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Добре дошли в административния панел на Дневника.
      </Typography>
    </div>
  )
}
