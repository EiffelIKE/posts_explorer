import { cx } from '../../lib/cx'
import styles from './Logo.module.css'

interface LogoProps {
  className?: string
}

/**
 * Posts Explorer mark, inlined from public/posts-explorer-logo.svg so the disc
 * can take the app's primary color through `--posts-explorer-primary` (an
 * <img> can't see CSS variables). Decorative: the wordmark always sits beside it.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      className={cx(styles.logo, className)}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle className={styles.logo__disc} cx="32" cy="32" r="31" />
      <g fill="#fff" fillRule="evenodd" transform="scale(2)">
        <path
          transform="translate(0 -1.3)"
          d="M10.75 10h5.9a4.6 4.6 0 0 1 0 9.2H13.5V22h-2.75V10Zm2.75 2.5v4.2h3.15a2.1 2.1 0 0 0 0-4.2H13.5Z"
        />
        <path
          transform="translate(2.9 3.808) scale(.88)"
          d="M29.5 18.6h-5.6a2.1 2.1 0 0 0 2.2 1.65c.8 0 1.45-.28 2-.85l1.15 1.2a4.4 4.4 0 0 1-3.25 1.55c-2.55 0-4.15-1.7-4.15-4.15s1.65-4.15 3.95-4.15c2.25 0 3.75 1.65 3.75 4.1l-.05.65Zm-5.6-1.5h3.65c-.16-.94-.8-1.5-1.8-1.5-.93 0-1.64.56-1.85 1.5Z"
        />
      </g>
    </svg>
  )
}
