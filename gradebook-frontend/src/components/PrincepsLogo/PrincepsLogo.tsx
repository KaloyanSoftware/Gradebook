import styles from './PrincepsLogo.module.scss'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  /** Show the italic "дневник" subtitle below the logo */
  subtitle?: boolean
  /**
   * 'dark' (default) — uses the real image; for light/cream backgrounds (sidebar, topbars).
   * 'light' — renders as styled text + SVG crown; for dark backgrounds (login panel).
   */
  variant?: 'dark' | 'light'
}

/** SVG crown that matches the Princeps brand mark */
const Crown = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 80 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Five-point crown body */}
    <path
      d="M6 42 L6 30 L18 12 L28 26 L40 6 L52 26 L62 12 L74 30 L74 42 Z"
      fill="#C9A24E"
    />
    {/* Base bar */}
    <rect x="6" y="39" width="68" height="6" rx="1.5" fill="#C9A24E" />
    {/* Tip balls */}
    <circle cx="18" cy="11"  r="4.5" fill="#C9A24E" />
    <circle cx="40" cy="5"   r="5"   fill="#C9A24E" />
    <circle cx="62" cy="11"  r="4.5" fill="#C9A24E" />
    {/* Subtle inner shading for depth */}
    <path
      d="M6 33 L18 18 L28 30 L40 12 L52 30 L62 18 L74 33"
      stroke="#A8842F"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />
  </svg>
)

export const PrincepsLogo = ({ size = 'md', subtitle = false, variant = 'dark' }: Props) => {
  if (variant === 'light') {
    // Text + SVG crown version — for dark backgrounds
    return (
      <div className={`${styles.root} ${styles[size]}`}>
        <div className={styles.textWordmark}>
          <Crown className={styles.textCrown} />
          <span className={styles.textLetters}>PRINCEPS</span>
        </div>
        {subtitle && (
          <span className={`${styles.subtitle} ${styles.subtitleLight}`}>дневник</span>
        )}
      </div>
    )
  }

  // Image version — for light/cream backgrounds
  return (
    <div className={`${styles.root} ${styles[size]}`}>
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
