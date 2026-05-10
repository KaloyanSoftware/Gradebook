import { NavLink, useNavigate } from 'react-router-dom'
import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import SchoolIcon from '@mui/icons-material/School'
import LinkIcon from '@mui/icons-material/Link'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import { useAuth } from '@/context/AuthContext'
import styles from './Sidebar.module.scss'

const mainNav = [
  { label: 'Табло', icon: <DashboardIcon fontSize="small" />, to: '/admin/dashboard' },
]

const userNav = [
  { label: 'Ученици', icon: <GroupIcon fontSize="small" />, to: '/admin/students' },
  { label: 'Родители', icon: <SchoolIcon fontSize="small" />, to: '/admin/parents' },
]

const managementNav = [
  { label: 'Връзки родител–ученик', icon: <LinkIcon fontSize="small" />, to: null },
]

interface Props {
  isOpen?: boolean
  onClose?: () => void
}

export const Sidebar = ({ isOpen, onClose }: Props) => {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.brand}>
        <Typography className={styles.brandText}>
          Princeps
        </Typography>
        <span className={styles.brandSub}>дневник</span>
      </div>

      <nav className={styles.nav}>
        <List dense disablePadding>
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
              onClick={onClose}
            >
              <ListItemButton className={styles.navItem}>
                <ListItemIcon className={styles.icon}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </NavLink>
          ))}
        </List>

        <Divider className={styles.divider} />

        <Typography className={styles.sectionLabel}>ПОТРЕБИТЕЛИ</Typography>
        <List dense disablePadding>
          {userNav.map((item) =>
            item.to ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                onClick={onClose}
              >
                <ListItemButton className={styles.navItem}>
                  <ListItemIcon className={styles.icon}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </NavLink>
            ) : (
              <ListItemButton key={item.label} disabled className={styles.navItem}>
                <ListItemIcon className={styles.icon}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} secondary="Очаква се" />
              </ListItemButton>
            ),
          )}
        </List>

        <Divider className={styles.divider} />

        <Typography className={styles.sectionLabel}>УПРАВЛЕНИЕ</Typography>
        <List dense disablePadding>
          {managementNav.map((item) => (
            <ListItemButton key={item.label} disabled className={styles.navItem}>
              <ListItemIcon className={styles.icon}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} secondary="Очаква се" />
            </ListItemButton>
          ))}
        </List>
      </nav>

      <div className={styles.footer}>
        <Divider className={styles.divider} />
        <List dense disablePadding>
          <NavLink
            to="/admin/settings"
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
