import styles from './PrincepsLogo.module.scss'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  /** Show the italic "дневник" subtitle below the logo */
  subtitle?: boolean
  /**
   * 'dark' (default) — SVG crown + dark ink text; for light/cream backgrounds (sidebar, topbars).
   * 'light'          — SVG crown + cream text;     for dark backgrounds (login panel).
   * 'image'          — real PNG brand image;        use sparingly where the card look is intentional.
   */
  variant?: 'dark' | 'light' | 'image'
}

const Crown = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 80 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M6 42 L6 30 L18 12 L28 26 L40 6 L52 26 L62 12 L74 30 L74 42 Z" fill="#C9A24E" />
    <rect x="6" y="39" width="68" height="6" rx="1.5" fill="#C9A24E" />
    <circle cx="18" cy="11" r="4.5" fill="#C9A24E" />
    <circle cx="40" cy="5"  r="5"   fill="#C9A24E" />
    <circle cx="62" cy="11" r="4.5" fill="#C9A24E" />
    <path
      d="M6 33 L18 18 L28 30 L40 12 L52 30 L62 18 L74 33"
      stroke="#A8842F" strokeWidth="1.5" fill="none" strokeLinejoin="round"
    />
  </svg>
)

export const PrincepsLogo = ({ size = 'md', subtitle = false, variant = 'dark' }: Props) => {
  if (variant === 'image') {
    return (
      <div className={`${styles.root} ${styles[size]}`}>
        <img src="/princeps-logo.png" alt="Princeps" className={styles.img} draggable={false} />
      </div>
    )
  }

  const isLight = variant === 'light'

  return (
    <div className={`${styles.root} ${styles[size]}`}>
      <div className={styles.wordmark}>
        <Crown className={styles.crown} />
        <span className={`${styles.letters} ${isLight ? styles.lettersLight : ''}`}>
          PRINCEPS
        </span>
      </div>
      {subtitle && (
        <span className={`${styles.subtitle} ${isLight ? styles.subtitleLight : ''}`}>
          дневник
        </span>
      )}
    </div>
  )
}
