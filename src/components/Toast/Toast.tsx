import React from "react";
import { theme } from "styles/theme";
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

const toastBodyStyle = {
  height: "70px",
};

export const showToast = (props: ToastProps) => {
  switch (props.type) {
    case "info":
      return toast.info(props.message, {
        progressStyle: {
          backgroundColor: theme.toast.info,
        },
        bodyStyle: toastBodyStyle,
        icon: <InfoIcon />,
      });
    case "success":
      return toast.success(props.message, {
        progressStyle: {
          backgroundColor: theme.toast.success,
        },
        bodyStyle: toastBodyStyle,
        icon: <SuccessIcon />,
      });
    case "error":
      return toast.error(props.message, {
        progressStyle: {
          backgroundColor: theme.toast.error,
        },
        bodyStyle: toastBodyStyle,
        icon: <ErrorIcon />,
      });
    case "warn":
      return toast.warn(props.message, {
        progressStyle: {
          backgroundColor: theme.toast.warn,
        },
        bodyStyle: toastBodyStyle,
        icon: <CautionIcon />,
      });
  }
};

export const Toast: React.FC = () => (
  <ToastContainer
    transition={Slide}
    position="top-center"
    closeButton={false}
    hideProgressBar
    autoClose={1500}
    closeOnClick
    newestOnTop
    rtl={false}
  />
);

export default Toast;
