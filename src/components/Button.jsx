import styles from './Button.module.css'

export function Button({ children, variant, ...props }) {
  return <button className={`${styles.button} ${styles[variant]}`}{...props}> {children}</button >;
}