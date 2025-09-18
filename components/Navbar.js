import styles from "../styles/Navbar.module.css";
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

import { VscJersey } from "react-icons/vsc";

export const siteTitle = "Game of Stones";

const navLinks = [
  { name: "Home", path: "/", icon: <HiOutlineHome /> },
  { name: "Blog", path: "/blog", icon: <HiOutlineNewspaper /> },
  { name: "History", path: "/history", icon: <HiOutlineTrophy /> },
  { name: "Season 4", path: "/season-4", icon: <VscJersey /> },
  {
    name: "Player Search",
    path: "/player-search",
    icon: <HiOutlineUserGroup />,
  },
  {
    name: "FPL Dashboard",
    path: "https://www.fpl-dashboard.com/",
    icon: <HiOutlineCog />,
  },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.navContent} content-wrapper`}>
        <div className={styles.linksContainer}>
          {navLinks.map((link) => {
            const isActive =
              link.path === "/"
                ? router.pathname === "/"
                : router.pathname.startsWith(link.path);
            const active = isActive
              ? styles.navLinkActive
              : styles.navLinkInactive;
            return (
              <div className={styles.navLink} key={link.path}>
                <Link href={link.path} ket={link.name} className={active}>
                  <div className={styles.icon}>{link.icon}</div>
                  <span className={styles.label}>{link.name}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
