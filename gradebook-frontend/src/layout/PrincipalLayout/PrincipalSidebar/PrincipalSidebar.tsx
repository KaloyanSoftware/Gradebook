import { NavLink, useNavigate } from 'react-router-dom'
import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import SchoolIcon from '@mui/icons-material/School'
import PeopleIcon from '@mui/icons-material/People'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import { useAuth } from '@/context/AuthContext'
import { PrincepsLogo } from '@/components/PrincepsLogo/PrincepsLogo'
import styles from './PrincipalSidebar.module.scss'

interface Props {
  isOpen?: boolean
  onClose?: () => void
}

export const PrincipalSidebar = ({ isOpen, onClose }: Props) => {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.brand}>
        <PrincepsLogo size="md" />
      </div>

      <nav className={styles.nav}>
        <List dense disablePadding>
          <NavLink
            to="/principal/dashboard"
            className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            onClick={onClose}
          >
            <ListItemButton className={styles.navItem}>
              <ListItemIcon className={styles.icon}><DashboardIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Табло" />
            </ListItemButton>
          </NavLink>
        </List>

        <Divider className={styles.divider} />

        <Typography className={styles.sectionLabel}>ПРЕПОДАВАТЕЛИ</Typography>
        <List dense disablePadding>
          <NavLink
            to="/principal/teachers"
            className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            onClick={onClose}
          >
            <ListItemButton className={styles.navItem}>
              <ListItemIcon className={styles.icon}><SchoolIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Преподаватели" />
            </ListItemButton>
          </NavLink>
        </List>

        <Divider className={styles.divider} />

        <Typography className={styles.sectionLabel}>ПОТРЕБИТЕЛИ</Typography>
        <List dense disablePadding>
          <NavLink
            to="/principal/students"
            className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            onClick={onClose}
          >
            <ListItemButton className={styles.navItem}>
              <ListItemIcon className={styles.icon}><GroupIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Ученици" />
            </ListItemButton>
          </NavLink>
          <NavLink
            to="/principal/parents"
            className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            onClick={onClose}
          >
            <ListItemButton className={styles.navItem}>
              <ListItemIcon className={styles.icon}><PeopleIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Родители" />
            </ListItemButton>
          </NavLink>
        </List>
      </nav>

      <div className={styles.footer}>
        <Divider className={styles.divider} />
        <List dense disablePadding>
          <NavLink
            to="/principal/settings"
            className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            onClick={onClose}
          >
            <ListItemButton className={styles.navItem}>
              <ListItemIcon className={styles.icon}><SettingsIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Настройки" />
            </ListItemButton>
          </NavLink>
          <ListItemButton onClick={handleLogout} className={styles.navItem}>
            <ListItemIcon className={styles.icon}><LogoutIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Изход" />
          </ListItemButton>
        </List>
      </div>
    </aside>
  )
}
