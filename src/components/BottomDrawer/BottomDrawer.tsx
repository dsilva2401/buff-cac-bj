import React, { ReactElement, useEffect, useState } from 'react';
import { PageStateType } from 'context/global/GlobalContext';
import { useGlobal } from '../../context/global/GlobalContext';
import { ReactComponent as Close } from 'assets/icons/svg/close.svg';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import phoneCallIcon from 'assets/icons/svg/social_phone-call.svg';
import instagramIcon from 'assets/icons/svg/social_instagram.svg';
import facebookIcon from 'assets/icons/svg/social_facebook.svg';
import twitterIcon from 'assets/icons/svg/social_twitter.svg';
import emailIcon from 'assets/icons/svg/social_email.svg';
import LinesEllipsis from 'react-lines-ellipsis';
import DrawerMask from 'components/DrawerMask';
import useHeights from 'hooks/useHeights';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Image from 'components/Image';
import {
  Drawer,
  DragBar,
  DrawerBody,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerIconLink,
} from './styles';
import { Position } from 'types/Misc';

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
  disableModalDismiss?: boolean;
  setMainDrawerOpen: (open: boolean) => void;
  mainDrawerOpen: boolean;
  position: Position;
  setPosition: (position: Position) => void;
};

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  title,
  children,
  isChildOpen,
  closeChild,
  buttons,
  socials,
  leadInformation,
  disableModalDismiss,
  setMainDrawerOpen,
  mainDrawerOpen,
  position,
  setPosition,
}) => {
  const {
    setPageState,
    retractDrawer,
    setRetractDrawer,
    appZoom,
    brandTheme,
    isPreviewMode,
  } = useGlobal();

  const { topHeight, bottomHeight } = useHeights();

  useEffect(() => {
    if (isPreviewMode) {
      if (isChildOpen) {
        setPosition({ ...position, y: topHeight });
      } else {
        setPosition({ ...position, y: bottomHeight });
      }
    }
  }, [
    isChildOpen,
    topHeight,
    bottomHeight,
    isPreviewMode,
    position,
    setPosition,
    appZoom,
  ]);

  const [deltaPosition, setDeltaPosition] = useState<number>(0);
  const [isControlled, setIsControlled] = useState<boolean>(true);

  useEffect(() => {
    if (position.y === topHeight) {
      setMainDrawerOpen(true);
    } else if (position.y === bottomHeight) {
      setMainDrawerOpen(false);
      closeChild();
    }
  }, [
    position,
    topHeight,
    bottomHeight,
    closeChild,
    setMainDrawerOpen,
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

  const validateSocials = (socials: SocialsType) => {
    return socials?.email ||
      socials?.facebook ||
      socials?.instagram ||
      socials?.phone ||
      socials?.twitter
      ? true
      : false;
  };

  return (
    <>
      <DrawerMask isDrawerOpen={!!mainDrawerOpen} />
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
            <DrawerHeader
              isDrawerOpen={mainDrawerOpen}
              isChildOpen={isChildOpen}
            >
              {!isChildOpen && (
                <Wrapper
                  justifyContent='space-between'
                  alignItems='center'
                  width='100%'
                >
                  <Wrapper width='65%'>
                    {title && (
                      <LinesEllipsis
                        trimRight
                        maxLine='2'
                        text={title}
                        ellipsis='...'
                        basedOn='letters'
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          lineHeight: '20px',
                        }}
                      />
                    )}
                  </Wrapper>
                  {mainDrawerOpen ? null : leadInformation}
                </Wrapper>
              )}
            </DrawerHeader>
            {mainDrawerOpen && !disableModalDismiss && (
              <DrawerClose
                onClick={() => {
                  if (isChildOpen) {
                    closeChild();
                    if (retractDrawer) {
                      setPosition({ ...position, y: bottomHeight });
                      setMainDrawerOpen(false);
                    }
                  } else {
                    setPageState(null);
                    setPosition({ ...position, y: bottomHeight });
                    setMainDrawerOpen(false);
                  }
                }}
              >
                <Close />
              </DrawerClose>
            )}
            <DrawerBody id={isChildOpen ? 'not-draggable' : 'draggable'}>
              <DragBar />
              {!mainDrawerOpen && (
                <Wrapper
                  gap='1rem'
                  width='100%'
                  direction='column'
                  margin={isChildOpen ? '5.25rem 0 0 0' : '0'}
                >
                  {buttons?.map((button) => {
                    return (
                      button.isHighlight && (
                        <Button
                          key={button.title}
                          brandTheme={brandTheme}
                          variant='dark'
                          inlineIcon
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
                      )
                    );
                  })}
                  <Button
                    variant='light'
                    brandTheme={brandTheme}
                    onClick={() => {
                      setPosition({ ...position, y: topHeight });
                      setRetractDrawer(false);
                    }}
                  >
                    More
                  </Button>
                </Wrapper>
              )}
              {mainDrawerOpen &&
                (isChildOpen ? (
                  children
                ) : (
                  <Wrapper width='100%' direction='column' gap='1rem'>
                    {buttons?.map((button) => (
                      <Button
                        key={button.title}
                        brandTheme={brandTheme}
                        variant={button.isHighlight ? 'dark' : 'light'}
                        inlineIcon
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
            {!isChildOpen && validateSocials(socials) && (
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
                    href={
                      socials?.twitter.includes('https://') ||
                      socials?.twitter.includes('http://')
                        ? socials?.twitter
                        : `https://${socials?.twitter}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Image src={twitterIcon} alt='twitter-icon' />
                  </DrawerIconLink>
                )}
                {socials?.instagram && (
                  <DrawerIconLink
                    href={
                      socials?.instagram.includes('https://') ||
                      socials?.instagram.includes('http://')
                        ? socials?.instagram
                        : `https://${socials?.instagram}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Image src={instagramIcon} alt='instagram-icon' />
                  </DrawerIconLink>
                )}
                {socials?.facebook && (
                  <DrawerIconLink
                    href={
                      socials?.facebook.includes('https://') ||
                      socials?.facebook.includes('http://')
                        ? socials?.facebook
                        : `https://${socials?.facebook}`
                    }
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
