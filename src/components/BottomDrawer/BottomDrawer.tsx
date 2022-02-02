import { ReactComponent as Close } from 'assets/icons/svg/close.svg';
import emailIcon from 'assets/icons/svg/social_email.svg';
import facebookIcon from 'assets/icons/svg/social_facebook.svg';
import instagramIcon from 'assets/icons/svg/social_instagram.svg';
import phoneCallIcon from 'assets/icons/svg/social_phone-call.svg';
import twitterIcon from 'assets/icons/svg/social_twitter.svg';
import Button from 'components/Button';
import DrawerMask from 'components/DrawerMask';
import Image from 'components/Image';
import LoadingIndicator from 'components/LoadingIndicator';
import Text from 'components/Text';
import Wrapper from 'components/Wrapper';
import { PageStateType } from 'context/global/GlobalContext';
import React, { ReactElement, useEffect, useState } from 'react';
import { isBrowser } from 'react-device-detect';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useGlobal } from '../../context/global/GlobalContext';
import {
  DragBar,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerIconLink,
} from './styles';

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
  loadingState?: boolean;
  leadInformation?: React.ReactNode;
  disableModalDismiss?: boolean;
};

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  title,
  children,
  isChildOpen,
  closeChild,
  buttons,
  socials,
  loadingState,
  leadInformation,
  disableModalDismiss,
}) => {
  const {
    setPageState,
    retractDrawer,
    setRetractDrawer,
    appZoom,
    isPreviewMode,
  } = useGlobal();

  const topHeight = 0;
  let bottomHeight: number;
  let margin = 280;
  if (isBrowser || isPreviewMode) {
    if (window.innerHeight < 600) margin = 310;
    else if (window.innerHeight >= 700 && window.innerHeight < 800)
      margin = 355;
    else if (window.innerHeight >= 800 && window.innerHeight < 900)
      margin = 375;
    else if (window.innerHeight >= 900 && window.innerHeight < 1000)
      margin = 400;
    else if (window.innerHeight >= 1000 && window.innerHeight < 1100)
      margin = window.innerHeight * 0.41;
    else if (window.innerHeight >= 1100) margin = window.innerHeight * 0.385;
  }

  if (isPreviewMode) {
    bottomHeight =
      window.innerHeight / appZoom - (window.innerHeight * 0.45) / appZoom;
  } else {
    bottomHeight = window.innerHeight - margin;
  }

  const [position, setPosition] = useState({ x: 0, y: bottomHeight });
  const [deltaPosition, setDeltaPosition] = useState<number>(0);
  const [isControlled, setIsControlled] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isChildOpen) {
      setPosition({ ...position, y: topHeight });
    } else {
      setPosition({ ...position, y: bottomHeight });
    }
  }, [isChildOpen, appZoom, bottomHeight, position]);

  useEffect(() => {
    if (position.y === topHeight) {
      setIsDrawerOpen(true);
    } else if (position.y === bottomHeight) {
      setIsDrawerOpen(false);
      closeChild();
    }
  }, [
    position,
    topHeight,
    bottomHeight,
    closeChild,
    setIsDrawerOpen,
    setPageState,
    isChildOpen,
    appZoom,
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
        <Drawer
          isControlled={isControlled}
          style={isPreviewMode ? { height: `calc((88vh / ${appZoom}))` } : {}}
        >
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
                  {isDrawerOpen ? null : leadInformation}
                </Wrapper>
              )}
              {isDrawerOpen && !disableModalDismiss && (
                <DrawerClose
                  onClick={() => {
                    if (isChildOpen) {
                      closeChild();
                      if (retractDrawer) {
                        setPosition({ ...position, y: bottomHeight });
                        setIsDrawerOpen(false);
                      }
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
            <DrawerBody id={isChildOpen ? 'not-draggable' : 'draggable'}>
              <DragBar />
              {!isDrawerOpen && (
                <>
                  {buttons?.map((button) => {
                    if (button.isHighlight) {
                      return (
                        <Button
                          key={button.title}
                          variant='dark'
                          onClick={() => {
                            if (button.icon === null) {
                              setPosition({ ...position, y: topHeight });
                              setRetractDrawer(true);
                            }
                            button.onClick();
                            if (button.pageState !== null)
                              setPageState(button.pageState);
                          }}
                        >
                          {button.title}
                          {button.icon}
                        </Button>
                      );
                    }
                    return <></>;
                  })}
                  <Button
                    variant='light'
                    onClick={() => {
                      setPosition({ ...position, y: topHeight });
                      setRetractDrawer(false);
                    }}
                  >
                    More
                  </Button>
                </>
              )}
              {isDrawerOpen &&
                (isChildOpen ? (
                  children
                ) : loadingState ? (
                  <Wrapper
                    width='100%'
                    height='100%'
                    direction='column'
                    alignItems='center'
                    justifyContent='center'
                  >
                    <LoadingIndicator />
                  </Wrapper>
                ) : (
                  <Wrapper width='100%' direction='column' gap='1rem'>
                    {buttons?.map((button) => (
                      <Button
                        key={button.title}
                        variant={button.isHighlight ? 'dark' : 'light'}
                        onClick={() => {
                          button.onClick();
                          setRetractDrawer(false);
                          if (button.pageState !== null)
                            setPageState(button.pageState);
                        }}
                      >
                        {button.title}
                        {button.icon}
                      </Button>
                    ))}
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
