import React from 'react';
import Text from 'components/Text';
import Wrapper from 'components/Wrapper';
import HtmlWrapper from 'components/HtmlWrapper';
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
      width='100%'
      direction='column'
      alignItems='flex-start'
      justifyContent='flex-start'
    >
      <Text
        fontSize='1rem'
        fontWeight='600'
        margin='1.25rem 3rem 1.25rem 0.75rem'
      >
        <h1>{drawerTitle}</h1>
      </Text>
      <Animated
        animationIn='slideInRight'
        animationOut='slideOutLeft'
        animationInDuration={retractDrawer ? 0 : 300}
        animationOutDuration={retractDrawer ? 0 : 300}
        isVisible={true}
      >
        <HtmlWrapper
          width='100%'
          direction='column'
          padding='1rem 0.75rem'
          dangerouslySetInnerHTML={{ __html: drawerData.content }}
        />
      </Animated>
    </Wrapper>
  );
};

export default CustomDrawer;
