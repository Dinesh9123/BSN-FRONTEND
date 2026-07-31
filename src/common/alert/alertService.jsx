import { useState } from "react";
import AlertBox from "./alertBox.jsx";


let setGlobalAlert;
let setGlobalConfirm;
export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    show: false,
    message: "",
    type: "auto",
    callback: null,
  });
  const [confirmState, setConfirmState] = useState({
    show: false,
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });
  setGlobalAlert = setAlertState;
  setGlobalConfirm = setConfirmState;
  return (
    <>
      {" "}
      {children}{" "}
      {alertState.show && (
        <AlertBox
          type={alertState.type}
          message={alertState.message}
          onClose={() => {
            setAlertState((prev) => ({ ...prev, show: false }));
            alertState.callback && alertState.callback();
          }}
        />
      )}{" "}
      {confirmState.show && (
        <AlertBox
          type="confirm"
          showCancel={true}
          message={confirmState.message}
          onConfirm={() => {
            confirmState.onConfirm();
            setConfirmState((prev) => ({ ...prev, show: false }));
          }}
          onClose={() => {
            confirmState.onCancel && confirmState.onCancel();
            setConfirmState((prev) => ({ ...prev, show: false }));
          }}
        />
      )}{" "}
    </>
  );
};
export const showAlert = (message, type = "auto", callback = null) => {
  if (!setGlobalAlert) {
    console.error("AlertProvider is not mounted yet");
    return;
  }
  setGlobalAlert({ show: true, message, type, callback });
};
export const showConfirm = (message, onConfirm, onCancel) => {
  setGlobalConfirm({ show: true, message, onConfirm, onCancel });
};