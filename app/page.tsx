import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>MindScroll</div>
        <p className={styles.status}>Foundations deploy — Day 1 of 10.</p>
      </div>
    </div>
  );
}
