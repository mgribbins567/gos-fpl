import styles from "./layout.module.css";
import Head from "next/head";
import Link from "next/link";

export const siteTitle = "Game of Stones";

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/images/logo.png" />
        <meta name="description" content="Game of Stones website" />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <header className={styles.topnav}>
        <Link href="/">Home</Link>
        <Link href="/blog">Blogs</Link>
        <Link href="/history">History</Link>
        <Link href="/about">About</Link>
        <Link href="https://www.fpl-dashboard.com/">
          {" "}
          FPL Dashboard by Kevin{" "}
        </Link>
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to Home</Link>
        </div>
      )}
    </div>
  );
}
