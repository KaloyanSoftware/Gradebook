import styles from './GradePicker.module.scss'

const GRADES: { value: number; color: string; label: string }[] = [
  { value: 2,   color: '#DC2626', label: '2' },
  { value: 2.5, color: '#EF4444', label: '2.5' },
  { value: 3,   color: '#EA580C', label: '3' },
  { value: 3.5, color: '#F97316', label: '3.5' },
  { value: 4,   color: '#CA8A04', label: '4' },
  { value: 4.5, color: '#EAB308', label: '4.5' },
  { value: 5,   color: '#65A30D', label: '5' },
  { value: 5.5, color: '#22C55E', label: '5.5' },
  { value: 6,   color: '#16A34A', label: '6' },
]

interface Props {
  value: number | null
  onChange: (v: number) => void
  disabled?: boolean
}

export const GradePicker = ({ value, onChange, disabled }: Props) => (
  <div className={styles.picker}>
    {GRADES.map((g) => (
      <button
        key={g.value}
        type="button"
        disabled={disabled}
        style={{ '--gc': g.color } as React.CSSProperties}
        className={`${styles.btn} ${value === g.value ? styles.selected : ''}`}
        onClick={() => onChange(g.value)}
      >
        {g.label}
      </button>
    ))}
  </div>
)
