import React from 'react';
import styled, { keyframes } from 'styled-components';
import { slideInLeft, slideInRight } from 'react-animations';

export interface AnimatedWrapperProps {
  children: React.ReactNode;
  direction?: string;
};

const AnimatedWrapper = (props: AnimatedWrapperProps) => {
  return <>{props.children}</>;
};

export default AnimatedWrapper;

const slideToRight = keyframes`${slideInLeft}`;
const RightSlider = styled.div`
  width: 100%;
  height: 100%;
  animation: 0.5s ${slideToRight};
`;

const slideToLeft = keyframes`${slideInRight}`;
const LeftSlider = styled.div`
  width: 100%;
  height: 100%;
  animation: 0.5s ${slideToLeft};
`;
