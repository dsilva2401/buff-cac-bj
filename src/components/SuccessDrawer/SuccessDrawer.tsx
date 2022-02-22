import React from 'react';
import { Drawer } from './styles';
import { useGlobal } from 'context/global/GlobalContext';
import DrawerMask from 'components/DrawerMask';
import CheckAnimation from './CheckAnimation';
import Text from 'components/Text';

type SuccessDrawerProps = {
  isOpen: boolean;
  title: string;
  description: string;
  close(): void;
};

const SuccessDrawer: React.FC<SuccessDrawerProps> = ({
  isOpen,
  title,
  description,
  close,
}) => {
  const { appTheme } = useGlobal();
  return (
    <>
      <DrawerMask
        isDrawerOpen={isOpen}
        zIndex={4}
        style={{ top: '-97%', backgroundColor: 'transparent' }}
        onClick={close}
      />
      <Drawer appTheme={appTheme} isOpen={isOpen}>
        {isOpen && (
          <>
            <CheckAnimation
              isDrawerOpen={isOpen}
            />
            <Text
              fontSize='2rem'
              fontWeight='700'
              color='#fff'
              textAlign='center'
            >
              <h3>{title}</h3>
            </Text>
            <Text
              fontSize='1rem'
              fontWeight='400'
              color='#fff'
              textAlign='center'
            >
              <p>{description}</p>
            </Text>
          </>
        )}
      </Drawer>
    </>
  );
};

export default SuccessDrawer;
