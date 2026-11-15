import styles from './NoUserSelected.module.css'

/** Desktop detail panel before a badge is picked: an empty badge slot. */
export function NoUserSelected() {
  return (
    <div className={styles.empty}>
      <div className={styles.empty__slot} aria-hidden="true">
        <span className={styles.empty__avatar} />
        <span className={styles.empty__lines}>
          <span />
          <span />
        </span>
      </div>
      <h1 className={styles.empty__title}>Pick someone from the directory</h1>
      <p className={styles.empty__text}>
        Their posts open here, along with a form to write a new one.
      </p>
    </div>
  )
}
