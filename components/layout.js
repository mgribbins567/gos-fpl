import styles from "./layout.module.css";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineNewspaper,
  HiOutlineTrophy,
  HiOutlineCog,
} from "react-icons/hi2";

export const siteTitle = "Game of Stones";

// const navLinks = [
//   { name: "Home", path: "/", icon: <HiOutlineHome /> },
//   { name: "Blog", path: "/blog", icon: <HiOutlineNewspaper /> },
//   { name: "History", path: "/history", icon: <HiOutlineTrophy /> },
//   {
//     name: "Player Search",
//     path: "/player-search",
//     icon: <HiOutlineUserGroup />,
//   },
//   {
//     name: "FPL Dashboard",
//     path: "https://www.fpl-dashboard.com/",
//     icon: <HiOutlineHome />,
//   },
// ];

// export default function Layout() {
//   const router = useRouter();

//   return (
//     <nav className={styles.navbar}>
//       <div className={`${styles.navContent} content-wrapper`}>
//         <div className={styles.logo}>
//           <Link href="/">
//           Game of Stones
//           </Link>
//         </div>
//         <div className={styles.linksContainer}>
//           {navLinks.map((link) => {
//             const isActive = router.pathname === link.path;
//             return (
//               <Link href={link.path} ket={link.name} className={`$styles.navLink} ${isActive ? styles.active : ''}`}>
//                 <div className={styles.icon}>{link.icon}</div>
//                 <span className={styles.label}>{link.name}</span></Link>
//             );
//           })}
//         </div>
//       </div>
//     </nav>
//   )
// }

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
        <Link href="/player-search">Player Search</Link>
        <Link href="/about">About</Link>
        <Link href="https://www.fpl-dashboard.com/" target="_blank">
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
