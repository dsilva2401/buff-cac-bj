import React from "react";
import Lottie from "react-lottie";
import animationData from "assets/lottie-animations/check-animation.json";

type CheckAnimationProps = {
  isDrawerOpen: boolean;
};

const CheckAnimation: React.FC<CheckAnimationProps> = ({ isDrawerOpen }) => {
  const defaultOptions = {
    loop: false,
    autoplay: isDrawerOpen,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie
    options={defaultOptions}
    height={100}
    width={100}
  />;
};

export default CheckAnimation;
