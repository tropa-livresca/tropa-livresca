import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({
  title,
  description,
  onClose,
  children,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        aria-describedby="modal-descricao"
      >
        <h2 id="modal-titulo">{title}</h2>
        <p id="modal-descricao">{description}</p>
        {children}
      </section>
    </div>
  );
}