import { NavLink } from 'react-router-dom'
import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SchoolIcon from '@mui/icons-material/School'
import LinkIcon from '@mui/icons-material/Link'
import styles from './Sidebar.module.scss'

const mainNav = [
  { label: 'Табло', icon: <DashboardIcon fontSize="small" />, to: '/admin/dashboard' },
]

const userNav = [
  { label: 'Добавяне на родител', icon: <PersonAddIcon fontSize="small" />, to: '/admin/parents/new' },
  { label: 'Добавяне на ученик', icon: <SchoolIcon fontSize="small" />, to: null },
]

const managementNav = [
  { label: 'Връзки родител–ученик', icon: <LinkIcon fontSize="small" />, to: null },
]

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Typography variant="h6" sx={{ fontWeight: 700 }} className={styles.brandText}>
          Дневник
        </Typography>
      </div>

      <nav className={styles.nav}>
        <List dense disablePadding>
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
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
    </aside>
  )
}
