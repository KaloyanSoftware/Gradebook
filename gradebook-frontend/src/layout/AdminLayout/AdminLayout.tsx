import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { Sidebar } from '../Sidebar/Sidebar'
import { PrincepsLogo } from '@/components/PrincepsLogo/PrincepsLogo'
import styles from './AdminLayout.module.scss'

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={styles.layout}>
      <div className={styles.mobileTopbar}>
        <button className={styles.hamburger} onClick={() => setSidebarOpen(true)} aria-label="Отвори меню">
          <MenuIcon />
        </button>
        <PrincepsLogo size="sm" />
      </div>

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
