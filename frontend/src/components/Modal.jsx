import React from "react";
import { modalStyles as styles } from "../assets/dummystyle";
import { X } from "lucide-react";

const Modal = ({ children, isOpen, onClose, title, hideHeader, showActionBtn, actionBtnIcon = null,
  actionBtnText, onActionClick =()=>{ }, containerClass, bodyClass
 }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={containerClass || styles.container}>
        {!hideHeader && (
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            {showActionBtn && (
              <button className={styles.actionButton} onClick={onActionClick}>
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}

            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        )}

        {hideHeader && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        )}

        <div className={bodyClass || styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
