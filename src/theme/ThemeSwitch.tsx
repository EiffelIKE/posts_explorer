import { Monitor, Moon, Sun } from 'lucide-react'
import { useThemePreference, type ThemePreference } from './theme'
import styles from './ThemeSwitch.module.css'

const options: Array<{
  value: ThemePreference
  label: string
  Icon: typeof Sun
}> = [
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
]

/** Segmented System / Light / Dark control built on native radios. */
export function ThemeSwitch() {
  const [preference, choose] = useThemePreference()

  return (
    <div role="radiogroup" aria-label="Theme" className={styles.switch}>
      {options.map(({ value, label, Icon }) => (
        <label key={value} className={styles.switch__option}>
          <input
            type="radio"
            name="theme"
            value={value}
            checked={preference === value}
            onChange={() => choose(value)}
            className={styles.switch__input}
          />
          <Icon aria-hidden="true" className={styles.switch__icon} />
          <span className={styles.switch__label}>{label}</span>
        </label>
      ))}
    </div>
  )
}
