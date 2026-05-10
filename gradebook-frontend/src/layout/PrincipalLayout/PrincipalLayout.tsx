import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { PrincipalSidebar } from './PrincipalSidebar/PrincipalSidebar'
import { PrincepsLogo } from '@/components/PrincepsLogo/PrincepsLogo'
import styles from './PrincipalLayout.module.scss'

export const PrincipalLayout = () => {
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

      <PrincipalSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
