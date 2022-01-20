import React from 'react';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import Button from 'components/Button';
import DrawerMask from 'components/DrawerMask';
import { Drawer } from './styles';
import alertIcon from 'assets/icons/svg/error-outline.svg';

type AlertDrawerProps = {
  isDrawerOpen: boolean;
  closeDrawer: () => void;
  callbackAction: () => void;
};

const AlertDrawer: React.FC<AlertDrawerProps> = ({
  isDrawerOpen,
  closeDrawer,
  callbackAction,
}) => {
  return (
    <>
      <DrawerMask isDrawerOpen={isDrawerOpen} onClick={() => closeDrawer()} />
      <Drawer isDrawerOpen={isDrawerOpen}>
        <Wrapper
          width='100%'
          direction='column'
          justifyContent='flex-start'
          alignItems='center'
          padding='1.2rem 1rem 1rem'
          gap='0.8rem'
        >
          <Wrapper
            justifyContent='center'
            alignItems='center'
            position='relative'
          >
            <img src={alertIcon} alt='Alert outline icon' />
          </Wrapper>

          <Text fontSize='1.4rem' fontWeight='600' color='#000'>
            <h2>Delete Account</h2>
          </Text>
          <Text
            fontSize='0.8rem'
            fontWeight='400'
            color='#414149'
            textAlign='center'
            margin='0 0 1rem'
          >
            <p>
              Are you sure you want to permanently delete your account? All of
              your registered items will return to their original unregistered
              state.
            </p>
          </Text>

          <Button variant='dark' warning onClick={() => callbackAction()}>
            Delete Account
          </Button>
          <Button variant='light' onClick={() => closeDrawer()}>
            Cancel
          </Button>
        </Wrapper>
      </Drawer>
    </>
  );
};

export default AlertDrawer;
