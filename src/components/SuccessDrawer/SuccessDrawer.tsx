import React from 'react';
import { Drawer } from './styles';
import { useGlobal } from 'context/global/GlobalContext';
import DrawerMask from 'components/DrawerMask';
import CheckAnimation from './CheckAnimation';
import Text from 'components/Text';

type SuccessDrawerProps = {
  isOpen: boolean;
  title: string;
  description: string | undefined;
  close(): void;
  loading: boolean;
  onCompleteAnimation: () => void;
};

const SuccessDrawer: React.FC<SuccessDrawerProps> = ({
  isOpen,
  title,
  description,
  close,
  loading,
  onCompleteAnimation,
}) => {
  const { brandTheme, appZoom } = useGlobal();
  return (
    <>
      <DrawerMask
        isDrawerOpen={isOpen}
        zIndex={4}
        style={{ backgroundColor: 'transparent' }}
        onClick={close}
      />
      <Drawer brandTheme={brandTheme} isOpen={isOpen} appZoom={appZoom}>
        {isOpen && (
          <>
            <CheckAnimation
              onComplete={onCompleteAnimation}
              loading={loading}
              isDrawerOpen={isOpen}
            />
          </>
        )}
        <div
          style={{
            marginTop: -30,
            opacity: loading ? 0 : 1,
          }}
        >
          <Text
            fontSize='2rem'
            fontWeight='700'
            color='#fff'
            textAlign='center'
          >
            <h3>{title || 'Demo'}</h3>
          </Text>
          <Text
            fontSize='1rem'
            fontWeight='400'
            color='#fff'
            textAlign='center'
          >
            <p>{description || 'Demo'}</p>
          </Text>
        </div>
      </Drawer>
    </>
  );
};

export default SuccessDrawer;
