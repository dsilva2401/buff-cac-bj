import React from 'react';
import { Animated } from 'react-animated-css';
import { useGlobal } from 'context/global/GlobalContext';
import useElementSize from 'hooks/useElementSize';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';

type ModuleWrapperProps = {
  children: any;
  drawerTitle?: string;
}

const ModuleWrapper: React.FC<ModuleWrapperProps> = ({ drawerTitle, children }) => {
  const [headerRef, { height }] = useElementSize();
  const { retractDrawer } = useGlobal();

  return (
    <Wrapper
      width='100%'
      direction='column'
      alignItems='flex-start'
      justifyContent='flex-start'
    >
      {drawerTitle && (
        <Wrapper
          ref={headerRef}
          width='100%'
          left='0'
          top='-1px'
          zIndex={1}
          minHeight='4rem'
          position='fixed'
          borderRadius='26px'
        >
          <Text
            fontSize='1rem'
            fontWeight='600'
            margin='1.25rem 4rem 1.25rem 1.75rem'
          >
            <h1>{drawerTitle}</h1>
          </Text>
        </Wrapper>
      )}
      <Animated
        isVisible={true}
        animationIn='slideInRight'
        animationOut='slideOutLeft'
        animationInDuration={retractDrawer ? 0 : 300}
        animationOutDuration={retractDrawer ? 0 : 300}
        style={{ padding: `${height}px 12px 12px 12px` }}
      >
        {children}
      </Animated>
    </Wrapper>
  );
};

export default ModuleWrapper;
