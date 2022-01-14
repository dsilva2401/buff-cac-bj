import React, { ReactElement, useEffect, useState } from 'react';
import { useGlobal } from '../../context/global/GlobalContext';
import { ReactComponent as Close } from 'assets/icons/svg/close.svg';
import { PageStateType, TransitionType } from 'context/global/GlobalContext';
import { ReactComponent as LockBlack } from 'assets/icons/svg/lock-filled.svg';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import phoneCallIcon from 'assets/icons/svg/social_phone-call.svg';
import instagramIcon from 'assets/icons/svg/social_instagram.svg';
import facebookIcon from 'assets/icons/svg/social_facebook.svg';
import twitterIcon from 'assets/icons/svg/social_twitter.svg';
import emailIcon from 'assets/icons/svg/social_email.svg';
import DrawerMask from 'components/DrawerMask';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerIconLink,
} from './styles';
import { theme } from 'styles/theme';

export type ButtonType = {
  title: any | undefined;
  onClick: () => void;
  isHighlight: boolean;
  locked: boolean;
  pageState: PageStateType | null;
  icon: ReactElement | null;
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
  leadInformation?: React.ReactNode;
  disableModalDismiss?: boolean
};

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  title,
  children,
  isChildOpen,
  closeChild,
  buttons,
  socials,
  leadInformation,
  disableModalDismiss
}) => {
  const { setPageState } = useGlobal();
  const topHeight = -window.innerHeight * 0.85;
  const bottomHeight = -window.innerHeight * 0.3;

  const [position, setPosition] = useState({ x: 0, y: bottomHeight });
  const [deltaPosition, setDeltaPosition] = useState<number>(0);
  const [isControlled, setIsControlled] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [transition, setTransition] = useState<TransitionType>('NONE');

  useEffect(() => {
    if (position.y === topHeight) {
      setIsDrawerOpen(true);
    } else if (position.y === bottomHeight) {
      setIsDrawerOpen(false);
      setTransition('NONE');
      closeChild();
    }
  }, [
    position,
    topHeight,
    bottomHeight,
    closeChild,
    setIsDrawerOpen,
    setPageState,
  ]);

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
      <DrawerMask isDrawerOpen={!!isDrawerOpen} />
      <Draggable
        axis='y'
        bounds={{ top: topHeight, bottom: bottomHeight }}
        position={position}
        onStart={handleStart}
        onDrag={handleDrag}
        onStop={handleStop}
        cancel='a, button, #not-draggable'
        disabled={disableModalDismiss}
      >
        <Drawer isControlled={isControlled}>
          <Wrapper
            width='100%'
            height='100%'
            direction='column'
            justifyContent='space-between'
            alignItems='center'
          >
            <DrawerHeader isChildOpen={isChildOpen}>
              {!isChildOpen && (
                <Wrapper
                  justifyContent='space-between'
                  width='100%'
                  alignItems='center'
                >
                  <Text fontSize='1rem' fontWeight='600'>
                    <h1>{title}</h1>
                  </Text>
                  {
                    isDrawerOpen ? null : leadInformation
                  }
                </Wrapper>
              )}
              {isDrawerOpen && !disableModalDismiss && (
                <DrawerClose
                  onClick={() => {
                    if (isChildOpen) {
                      closeChild();
                      setTransition('RIGHT');
                    } else {
                      setPageState(null);
                      setPosition({ ...position, y: bottomHeight });
                      setIsDrawerOpen(false);
                    }
                  }}
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
                          key={button.title}
                          variant='dark'
                          onClick={() => {
                            setPosition({ ...position, y: topHeight });
                            button.onClick();
                            if (button.pageState !== null)
                              setPageState(button.pageState);
                          }}
                        >
                          {button.title}{button.icon}
                          {button.locked && (
                            <LockBlack
                              fill={button.isHighlight ? theme.secondary : theme.primary}
                              width='20px'
                            />
                          )}
                        </Button>
                      );
                    }
                    return <></>;
                  })}
                  <Button
                    variant='light'
                    onClick={() => setPosition({ ...position, y: topHeight })}
                  >
                    More
                  </Button>
                </>
              )}
              {isDrawerOpen &&
                (isChildOpen
                  ? children
                  : (
                    <Wrapper width='100%' direction='column' gap='1rem'>
                      {buttons?.map((button) =>
                        <Button
                          key={button.title}
                          variant={button.isHighlight ? 'dark' : 'light'}
                          onClick={() => {
                            button.onClick();
                            if (button.pageState !== null)
                              setPageState(button.pageState);
                          }}
                        >
                          {button.title}{button.icon}
                          {button.locked && (
                            <LockBlack
                              fill={button.isHighlight ? theme.secondary : theme.primary}
                              width='20px'
                            />
                          )}
                        </Button>
                      )}
                    </Wrapper>
                  ))}
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