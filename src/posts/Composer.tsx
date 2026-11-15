import { useId, useRef, useState, type FormEvent } from 'react'
import { CircleAlert, LoaderCircle, PenLine, Plus } from 'lucide-react'
import { z } from 'zod'
import type { NewPost } from '../types'
import { cx } from '../lib/cx'
import button from '../ui/button.module.css'
import styles from './Composer.module.css'

const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Add a title.')
    .max(120, 'Keep the title under 120 characters.'),
  body: z.string().trim().min(1, 'Write something in the body.'),
})

type Field = keyof NewPost
type FieldErrors = Partial<Record<Field, string>>

function validate(values: NewPost): FieldErrors {
  const result = postSchema.safeParse(values)
  if (result.success) return {}
  const errors: FieldErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as Field
    errors[field] ??= issue.message
  }
  return errors
}

const emptyDraft: NewPost = { title: '', body: '' }

interface ComposerProps {
  authorFirstName: string
  onPublish: (post: NewPost) => Promise<void>
}

/** Collapsed "New post" bar that opens into the validated form in place. */
export function Composer({ authorFirstName, onPublish }: ComposerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<NewPost>(emptyDraft)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<
    'idle' | 'publishing' | 'failed' | 'published'
  >('idle')

  const formId = useId()
  const titleId = useId()
  const bodyId = useId()
  const barRef = useRef<HTMLButtonElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const hasDraft = draft.title.trim() !== '' || draft.body.trim() !== ''
  const isPublishing = status === 'publishing'

  function openForm() {
    setOpen(true)
    setStatus('idle')
    requestAnimationFrame(() => titleRef.current?.focus())
  }

  function closeForm({ discard }: { discard: boolean }) {
    if (discard) {
      setDraft(emptyDraft)
      setErrors({})
      setSubmitted(false)
    }
    setOpen(false)
    if (status === 'failed') setStatus('idle')
    requestAnimationFrame(() => barRef.current?.focus())
  }

  function update(field: Field, value: string) {
    const next = { ...draft, [field]: value }
    setDraft(next)
    // Live revalidation only after the first submit attempt.
    if (submitted) setErrors(validate(next))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isPublishing) return
    setSubmitted(true)
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    if (nextErrors.title) return titleRef.current?.focus()
    if (nextErrors.body) return bodyRef.current?.focus()

    setStatus('publishing')
    try {
      await onPublish({ title: draft.title.trim(), body: draft.body.trim() })
      setDraft(emptyDraft)
      setSubmitted(false)
      setOpen(false)
      setStatus('published')
      requestAnimationFrame(() => barRef.current?.focus())
    } catch {
      setStatus('failed')
    }
  }

  if (!open) {
    return (
      <div className={styles.composer}>
        <button
          ref={barRef}
          type="button"
          className={styles.bar}
          aria-expanded="false"
          aria-controls={formId}
          onClick={openForm}
        >
          <span className={styles.bar__prompt}>
            <PenLine aria-hidden="true" />
            {hasDraft
              ? 'Continue your draft'
              : `Write a new post as ${authorFirstName}`}
          </span>
          <span
            className={cx(
              button.button,
              button['button--primary'],
              styles.bar__action,
            )}
          >
            <Plus aria-hidden="true" />
            New post
          </span>
        </button>
        <p role="status" className={styles.notice}>
          {status === 'published' &&
            'Published. JSONPlaceholder doesn’t store posts, so this one lives in this tab and disappears when you reload.'}
        </p>
      </div>
    )
  }

  return (
    <form
      id={formId}
      className={cx(styles.composer, styles.form)}
      aria-labelledby={`${formId}-heading`}
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !isPublishing) {
          event.preventDefault()
          closeForm({ discard: false })
        }
      }}
    >
      <h2 id={`${formId}-heading`} className={styles.form__heading}>
        New post as {authorFirstName}
      </h2>

      <div className={styles.field}>
        <label htmlFor={titleId} className={styles.field__label}>
          Title
        </label>
        <input
          ref={titleRef}
          id={titleId}
          className={cx(
            styles.field__control,
            errors.title && styles['field__control--invalid'],
          )}
          value={draft.title}
          onChange={(event) => update('title', event.target.value)}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? `${titleId}-error` : undefined}
          readOnly={isPublishing}
          autoComplete="off"
        />
        {errors.title && (
          <p id={`${titleId}-error`} className={styles.field__error}>
            <CircleAlert aria-hidden="true" />
            {errors.title}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={bodyId} className={styles.field__label}>
          Body
        </label>
        <textarea
          ref={bodyRef}
          id={bodyId}
          rows={5}
          className={cx(
            styles.field__control,
            styles['field__control--multiline'],
            errors.body && styles['field__control--invalid'],
          )}
          value={draft.body}
          onChange={(event) => update('body', event.target.value)}
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={errors.body ? `${bodyId}-error` : undefined}
          readOnly={isPublishing}
        />
        {errors.body && (
          <p id={`${bodyId}-error`} className={styles.field__error}>
            <CircleAlert aria-hidden="true" />
            {errors.body}
          </p>
        )}
      </div>

      {status === 'failed' && (
        <p role="alert" className={styles.failure}>
          <CircleAlert aria-hidden="true" />
          Couldn’t publish your post. Check your connection and try again.
        </p>
      )}

      <div className={styles.form__footer}>
        <p className={styles.form__hint}>
          Saved for this tab only. The demo API doesn’t store posts.
        </p>
        <div className={styles.form__actions}>
          <button
            type="button"
            className={cx(button.button, button['button--ghost'])}
            onClick={() => closeForm({ discard: true })}
            disabled={isPublishing}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={cx(button.button, button['button--primary'])}
            disabled={isPublishing}
          >
            {isPublishing && (
              <LoaderCircle aria-hidden="true" className={button.spin} />
            )}
            {isPublishing ? 'Publishing…' : 'Publish post'}
          </button>
        </div>
      </div>
    </form>
  )
}
