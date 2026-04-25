import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'
import styles from './AdminLayout.module.scss'

export const AdminLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
