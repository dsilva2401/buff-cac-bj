import React from 'react';
import Text from 'components/Text';
import Wrapper from 'components/Wrapper';
import { Animated } from 'react-animated-css';
import { useGlobal } from 'context/global/GlobalContext';
import { CustomModuleType } from 'types/ProductDetailsType';

type CustomDrawerProps = {
  drawerTitle: string;
  drawerData: CustomModuleType;
};

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  drawerTitle,
  drawerData,
}) => {
  const { retractDrawer } = useGlobal();

  return (
    <Wrapper
      direction='column'
      alignItems='flex-start'
      justifyContent='flex-start'
    >
      <Text
        fontSize='1rem'
        fontWeight='600'
        margin='1.25rem 3rem 1.25rem 1rem'
      >
        <h1>{drawerTitle}</h1>
      </Text>
      <Animated
        animationIn='slideInRight'
        animationOut='slideOutLeft'
        animationInDuration={300}
        animationOutDuration={300}
        animationInDelay={retractDrawer ? 200 : 0}
        isVisible={true}
      >
        <Wrapper
          width='100%'
          gap='0.75rem'
          direction='column'
          padding='0.5rem 1rem'
          dangerouslySetInnerHTML={{ __html: drawerData.content }}
        />
      </Animated>
    </Wrapper>
  );
};

export default CustomDrawer;
