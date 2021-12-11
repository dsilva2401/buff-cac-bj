import { ReactComponent as Close } from 'assets/icons/svg/close.svg';
import { ReactComponent as LockBlack } from 'assets/icons/svg/lock-black.svg';
import emailIcon from 'assets/icons/svg/social_email.svg';
import facebookIcon from 'assets/icons/svg/social_facebook.svg';
import instagramIcon from 'assets/icons/svg/social_instagram.svg';
import phoneCallIcon from 'assets/icons/svg/social_phone-call.svg';
import twitterIcon from 'assets/icons/svg/social_twitter.svg';
import Button from 'components/Button';
import DrawerMask from 'components/DrawerMask';
import Image from 'components/Image';
import Text from 'components/Text';
import Wrapper from 'components/Wrapper';
import { PageStateType } from 'context/global/GlobalContext';
import React, { useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useHistory } from 'react-router';
import { useGlobal } from '../../context/global/GlobalContext';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerIconLink,
} from './styles';

type ButtonType = {
  title: string | undefined;
  onClick: () => void;
  isHighlight: boolean;
  locked: boolean;
  pageState: PageStateType;
};

type SocialsType =
  | {
      phone?: string | undefined;
      email?: string | undefined;
      twitter?: string | undefined;
      instagram?: string | undefined;
      facebook?: string | undefined;
    }
  | undefined;

type BottomDrawerProps = {
  title: string | undefined;
  children: React.ReactNode;
  isChildOpen: boolean;
  closeChild: () => void;
  buttons: ButtonType[] | null;
  socials: SocialsType;
};

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  title,
  children,
  isChildOpen,
  closeChild,
  buttons,
  socials,
}) => {
  const history = useHistory();
  const { setPageState } = useGlobal();
  const topHeight = -window.innerHeight * 0.85;
  const bottomHeight = -window.innerHeight * 0.3;

  const [position, setPosition] = useState({ x: 0, y: bottomHeight });
  const [deltaPosition, setDeltaPosition] = useState(0);
  const [isControlled, setIsControlled] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (position.y === topHeight) {
      setIsDrawerOpen(true);
    } else if (position.y === bottomHeight) {
      setIsDrawerOpen(false);
      closeChild();
    }
  }, [position, topHeight, bottomHeight, closeChild]);

  const handleStart = () => {
    setIsControlled(false);
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ ...position, y: data.y });
    setDeltaPosition(data.deltaY);
  };

  const handleStop = () => {
    setIsControlled(true);

    if (deltaPosition > 0) {
      setPosition({ ...position, y: bottomHeight });
    } else {
      if (position.y === bottomHeight) {
        setPosition({ ...position, y: bottomHeight });
      } else {
        setPosition({ ...position, y: topHeight });
      }
    }
  };

  return (
    <>
      <DrawerMask
        isDrawerOpen={isDrawerOpen}
        // onClick={() => setPosition({ ...position, y: bottomHeight })}
      />
      <Draggable
        axis='y'
        bounds={{ top: topHeight, bottom: bottomHeight }}
        position={position}
        onStart={handleStart}
        onDrag={handleDrag}
        onStop={handleStop}
        cancel='a, button, #not-draggable'
      >
        <Drawer isControlled={isControlled}>
          <Wrapper
            width='100%'
            height='100%'
            direction='column'
            justifyContent='space-between'
            alignItems='center'
          >
            <DrawerHeader>
              <Text fontSize='1rem' fontWeight='600'>
                <h1>{title}</h1>
              </Text>
              {isDrawerOpen && (
                <DrawerClose
                  onClick={
                    isChildOpen
                      ? () => closeChild()
                      : () => setPosition({ ...position, y: bottomHeight })
                  }
                >
                  <Close />
                </DrawerClose>
              )}
            </DrawerHeader>
            <DrawerBody id='not-draggable'>
              {!isDrawerOpen && (
                <>
                  {buttons?.map((button) => {
                    if (button.isHighlight) {
                      return (
                        <Button
                          theme='dark'
                          onClick={() => {
                            setPosition({ ...position, y: topHeight });
                            button.onClick();
                            if (button.pageState)
                              setPageState(button.pageState);
                          }}
                        >
                          {button.title}
                          {button.locked && (
                            <LockBlack
                              fill={button.isHighlight ? '#FFFFFF' : '#000000'}
                              width='20px'
                            />
                          )}
                        </Button>
                      );
                    }
                    return <></>;
                  })}
                  <Button
                    theme='light'
                    onClick={() => setPosition({ ...position, y: topHeight })}
                  >
                    More
                  </Button>
                </>
              )}
              {isDrawerOpen &&
                (isChildOpen
                  ? children
                  : buttons?.map((button) => {
                      return (
                        <Button
                          key={button.title}
                          theme={button.isHighlight ? 'dark' : 'light'}
                          onClick={() => {
                            if (button.locked) history.push('/');
                            else button.onClick();
                            if (button.pageState)
                              setPageState(button.pageState);
                          }}
                        >
                          {button.title}
                          {button.locked && (
                            <LockBlack
                              fill={button.isHighlight ? '#FFFFFF' : '#000000'}
                              width='20px'
                            />
                          )}
                        </Button>
                      );
                    }))}
            </DrawerBody>
            {!isChildOpen && (
              <DrawerFooter>
                {socials?.phone && (
                  <DrawerIconLink href={`tel:+${socials.phone}`}>
                    <Image src={phoneCallIcon} alt='phone-icon' />
                  </DrawerIconLink>
                )}
                {socials?.email && (
                  <DrawerIconLink href={`mailto:${socials?.email}`}>
                    <Image src={emailIcon} alt='email-icon' />
                  </DrawerIconLink>
                )}
                {socials?.twitter && (
                  <DrawerIconLink
                    href={`http://${socials?.twitter}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Image src={twitterIcon} alt='twitter-icon' />
                  </DrawerIconLink>
                )}
                {socials?.instagram && (
                  <DrawerIconLink
                    href={`http://${socials?.instagram}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Image src={instagramIcon} alt='instagram-icon' />
                  </DrawerIconLink>
                )}
                {socials?.facebook && (
                  <DrawerIconLink
                    href={`http://${socials?.facebook}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Image src={facebookIcon} alt='facebook-icon' />
                  </DrawerIconLink>
                )}
              </DrawerFooter>
            )}
          </Wrapper>
        </Drawer>
      </Draggable>
    </>
  );
};

export default BottomDrawer;
