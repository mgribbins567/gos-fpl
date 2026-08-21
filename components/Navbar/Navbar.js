import { Group } from "@mantine/core";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineNewspaper,
  HiOutlineTrophy,
  HiOutlineCog,
  HiOutlineBookOpen,
  HiOutlineTableCells,
} from "react-icons/hi2";

import { VscJersey } from "react-icons/vsc";

export const siteTitle = "Game of Stones";

const navLinks = [
  { name: "Home", path: "/", icon: <HiOutlineHome /> },
  { name: "My Team", path: "/fantasy", icon: <VscJersey /> },
  { name: "League", path: "/league", icon: <HiOutlineTableCells /> },
  { name: "Cups", path: "/cup", icon: <HiOutlineTrophy /> },
  { name: "Blog", path: "/blog", icon: <HiOutlineNewspaper /> },
  { name: "History", path: "/history", icon: <HiOutlineBookOpen /> },
  // {
  //   name: "Players",
  //   path: "/player-search",
  //   icon: <HiOutlineUserGroup />,
  // },
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

export function NewNavbar() {
  const router = useRouter();
  return (
    <Group>
      {navLinks.map((link) => {
        const isActive =
          link.path === "/"
            ? router.pathname === "/"
            : router.pathname.startsWith(link.path);
        const active = isActive ? styles.navLinkActive : styles.navLinkInactive;
        return (
          <div className={styles.navLink} key={link.path}>
            <Link href={link.path} ket={link.name} className={active}>
              <div className={styles.icon}>{link.icon}</div>
              <span className={styles.label}>{link.name}</span>
            </Link>
          </div>
        );
      })}
    </Group>
  );
}
