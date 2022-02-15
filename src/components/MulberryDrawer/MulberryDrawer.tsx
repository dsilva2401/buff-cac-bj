import React from 'react';
import Text from 'components/Text';
import Wrapper from 'components/Wrapper';
import { Animated } from 'react-animated-css';
import { useGlobal } from 'context/global/GlobalContext';
import { ReactComponent as MulberryLogo } from 'assets/logos/svg/mulberry-logo.svg';

const MulberryDrawer: React.FC = () => {
  const { retractDrawer } = useGlobal();

  return (
    <Wrapper
      width='100%'
      direction='column'
      alignItems='flex-start'
      justifyContent='flex-start'
    >
      <MulberryLogo width='7.2rem' style={{ margin: '1.25rem 3rem 1.25rem 0.75rem' }} />
      <Animated
        animationIn='slideInRight'
        animationOut='slideOutLeft'
        animationInDuration={retractDrawer ? 0 : 300}
        animationOutDuration={retractDrawer ? 0 : 300}
        isVisible={true}
      >
        <Text fontSize='1.5rem' padding='0 0.75rem'>
          <p>Mulberry Iframe...</p>
        </Text>
      </Animated>
    </Wrapper>
  );
};

export default MulberryDrawer;
