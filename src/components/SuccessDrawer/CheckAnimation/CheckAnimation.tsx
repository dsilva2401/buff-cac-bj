import React from 'react';
import Lottie from 'react-lottie';
import circularAnimationData from 'assets/lottie-animations/pre-circular-animation.json';

type CheckAnimationProps = {
  isDrawerOpen: boolean;
  loading: boolean;
  onComplete: () => void;
};

const CheckAnimation: React.FC<CheckAnimationProps> = ({
  isDrawerOpen,
  loading,
  onComplete,
}) => {
  if (!isDrawerOpen) {
    return null;
  }

  const circularLoadingAnimationConfig = {
    loop: loading,
    autoplay: true,
    animationData: circularAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
    initialSegment: loading ? [10, 40] : [40, 120],
  };

  // I am using key as a hack here
  // I want the same lottie component to get completely removed and remounted
  // TODO: Remove this if causes performance issues

  return (
    <Lottie
      key={loading ? 'loading' : 'loaded'}
      speed={0.7}
      options={circularLoadingAnimationConfig}
      height={150}
      width={150}
      eventListeners={[{ eventName: 'complete', callback: onComplete }]}
    />
  );
};

export default CheckAnimation;
