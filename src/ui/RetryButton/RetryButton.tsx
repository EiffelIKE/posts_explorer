import { LoaderCircle } from 'lucide-react'
import { cx } from '../../lib/cx'
import button from '../button.module.css'

interface RetryButtonProps {
  onRetry: () => void
  /** True while the refetch runs. TanStack keeps `status: 'error'` meanwhile. */
  retrying: boolean
}

/**
 * "Try again" for error states. While retrying it shows a spinner and ignores
 * clicks. It uses `aria-disabled` rather than `disabled`, so keyboard focus
 * stays on the button instead of dropping to the page.
 */
export function RetryButton({ onRetry, retrying }: RetryButtonProps) {
  return (
    <button
      type="button"
      className={cx(button.button, button['button--secondary'])}
      aria-disabled={retrying || undefined}
      onClick={() => {
        if (!retrying) onRetry()
      }}
    >
      {retrying && <LoaderCircle aria-hidden="true" className={button.spin} />}
      {retrying ? 'Retrying…' : 'Try again'}
    </button>
  )
}
