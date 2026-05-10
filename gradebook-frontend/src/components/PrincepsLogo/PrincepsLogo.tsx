import styles from './PrincepsLogo.module.scss'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  /** Show the italic "дневник" subtitle below the logo */
  subtitle?: boolean
  /** 'dark' (default) = normal image; 'light' = brightened for dark backgrounds */
  variant?: 'dark' | 'light'
}

export const PrincepsLogo = ({ size = 'md', subtitle = false, variant = 'dark' }: Props) => {
  return (
    <div className={`${styles.root} ${styles[size]} ${variant === 'light' ? styles.light : ''}`}>
      <img
        src="/princeps-logo.png"
        alt="Princeps"
        className={styles.img}
        draggable={false}
      />
      {subtitle && (
        <span className={styles.subtitle}>дневник</span>
      )}
    </div>
  )
}
