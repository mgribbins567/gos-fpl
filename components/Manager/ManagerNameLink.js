import { useState } from "react";
import styles from "../Manager/ManagerHistory.module.css";
import ManagerHistory from "./ManagerHistory";

export default function ManagerNameLink({ manager }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <span onClick={() => setIsOpen(true)} className={styles.managerName}>
        {manager}
      </span>

      {isOpen && (
        <ManagerHistory managerId={manager} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
