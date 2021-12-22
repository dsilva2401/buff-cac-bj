import React from "react";
import { toast, Slide } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactComponent as SuccessIcon } from "assets/icons/svg/toast-success.svg";
import { ReactComponent as CautionIcon } from "assets/icons/svg/toast-caution.svg";
import { ReactComponent as ErrorIcon } from "assets/icons/svg/toast-error.svg";
import { ReactComponent as InfoIcon } from "assets/icons/svg/toast-info.svg";

type ToastProps = {
  message: string;
  type: "info" | "success" | "error" | "warn";
};

export const showToast = (props: ToastProps) => {
  switch (props.type) {
    case "info":
      return toast.info(props.message, {
        progressStyle: {
          backgroundColor: "#4B6EFA",
        },
        icon: <InfoIcon />,
      });
    case "success":
      return toast.success(props.message, {
        progressStyle: {
          backgroundColor: "#25AE88",
        },
        icon: <SuccessIcon />,
      });
    case "error":
      return toast.error(props.message, {
        progressStyle: {
          backgroundColor: "#FD6157",
        },
        icon: <ErrorIcon />,
      });
    case "warn":
      return toast.warn(props.message, {
        progressStyle: {
          backgroundColor: "#FE931E",
        },
        icon: <CautionIcon />,
      });
  }
};

export const Toast: React.FC = () => (
  <ToastContainer
    transition={Slide}
    position="top-center"
    closeButton={false}
    autoClose={3000}
    closeOnClick
    newestOnTop
    rtl={false}
  />
);

export default Toast;
