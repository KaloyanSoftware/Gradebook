import styles from './PrincepsLogo.module.scss'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  /** Show the italic "дневник" subtitle below the wordmark */
  subtitle?: boolean
  /** 'dark' (default) = ink text on light bg; 'light' = cream text on dark bg */
  variant?: 'dark' | 'light'
}

/**
 * Princeps crown wordmark.
 * The gold crown sits centred above the "I" (3rd character).
 * Uses Cormorant Garamond — loaded via Google Fonts in index.html.
 */
export const PrincepsLogo = ({ size = 'md', subtitle = false, variant = 'dark' }: Props) => {
  return (
    <div className={`${styles.root} ${styles[size]} ${variant === 'light' ? styles.light : ''}`}>
      <div className={styles.wordmark}>
        {/* Crown SVG — centred over the "I" */}
        <span className={styles.crownWrapper} aria-hidden="true">
          <svg
            className={styles.crown}
            viewBox="0 0 48 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Crown body */}
            <path
              d="M4 28 L4 20 L12 8 L24 18 L36 8 L44 20 L44 28 Z"
              fill="#C9A24E"
            />
            {/* Left point ball */}
            <circle cx="12" cy="7" r="2.8" fill="#C9A24E" />
            {/* Center point ball */}
            <circle cx="24" cy="5" r="3.2" fill="#C9A24E" />
            {/* Right point ball */}
            <circle cx="36" cy="7" r="2.8" fill="#C9A24E" />
            {/* Bottom base bar */}
            <rect x="4" y="26" width="40" height="4" rx="1" fill="#C9A24E" />
            {/* Inner highlight cut-outs to give the crown definition */}
            <path
              d="M4 22 L12 12 L24 20 L36 12 L44 22"
              stroke="#A8842F"
              strokeWidth="1"
              fill="none"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {/* Wordmark text — split so crown aligns over "I" */}
        <span className={styles.text}>
          <span className={styles.part}>PR</span>
          <span className={styles.letterI}>I</span>
          <span className={styles.part}>NCEPS</span>
        </span>
      </div>

      {subtitle && (
        <span className={styles.subtitle}>дневник</span>
      )}
    </div>
  )
}
