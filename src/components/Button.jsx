import styles from './Button.module.css'

export function Button({ children, variant, ...props }) {
  return <button className={`${styles[variant]}`}{...props}> {children}</button >;
}