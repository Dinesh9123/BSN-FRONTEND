import React, { useEffect } from "react";
import "../../css/alertBox.css";

export default function AlertBox({
  type = "auto",
  message,
  showCancel = true,
  onConfirm,
  onClose,
  onCancelClick, // optional for Cancel button
}) {
  useEffect(() => {
    if (type === "auto") {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  return (
    <div className={`alert-overlay ${type}`}>
      <div className="alert-box">
        <div className="alert-message">{message}</div>

        {type === "confirm" && (
          <div className="alert-actions">
            <button className="btn-yes" onClick={onConfirm}>
              Yes
            </button>

            <button className="btn-no" onClick={onClose}>
              No
            </button>

            {showCancel && onCancelClick && (
              <button className="btn-cancel" onClick={onCancelClick}>
                Cancel
              </button>
            )}
          </div>
        )}

        {type === "ok" && (
          <div className="alert-actions">
            <button className="btn-ok" onClick={onConfirm || onClose}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}