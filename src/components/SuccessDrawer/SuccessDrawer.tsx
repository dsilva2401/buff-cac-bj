import React from 'react';
import { Drawer } from './styles';
import Text from 'components/Text';
import CheckAnimation from './CheckAnimation';
import DrawerMask from 'components/DrawerMask';

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
  return (
    <>
      <DrawerMask
        isDrawerOpen={isOpen}
        zIndex={4}
        style={{ top: '-97%', backgroundColor: 'transparent' }}
        onClick={close}
      />
      <Drawer isOpen={isOpen}>
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
