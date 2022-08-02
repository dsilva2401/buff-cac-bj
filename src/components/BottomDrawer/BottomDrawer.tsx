import React, {
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Position } from 'types/Misc';
import { useTranslation } from 'react-i18next';
import { Product } from 'types/ProductDetailsType';
import { useGlobal } from 'context/global/GlobalContext';
import { isAndroid, isDesktop } from 'react-device-detect';
import { ReactComponent as Close } from 'assets/icons/svg/close.svg';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import phoneCallIcon from 'assets/icons/svg/social-phone-call.svg';
import instagramIcon from 'assets/icons/svg/social-instagram.svg';
import facebookIcon from 'assets/icons/svg/social-facebook.svg';
import twitterIcon from 'assets/icons/svg/social-twitter.svg';
import tiktokIcon from 'assets/icons/svg/social-tiktok.svg';
import emailIcon from 'assets/icons/svg/social-email.svg';
import useElementSize from 'hooks/useElementSize';
import LinesEllipsis from 'react-lines-ellipsis';
import DrawerMask from 'components/DrawerMask';
import useHeights from 'hooks/useHeights';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';
import {
  Drawer,
  DragBar,
  DragZone,
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
  icon: ReactElement | null;
  moduleType: string;
  moduleData?: string | undefined;
};

type SocialsType =
  | {
      phone?: string | undefined;
      email?: string | undefined;
      twitter?: string | undefined;
      instagram?: string | undefined;
      facebook?: string | undefined;
      tiktok?: string | undefined;
    }
  | undefined;

type BottomDrawerProps = {
  title: string | undefined;
  subtitle: string | undefined;
  children: React.ReactNode;
  isChildOpen: boolean;
  closeChild: (closeDrawer?: boolean) => void;
  buttons: ButtonType[] | null;
  socials: SocialsType;
  leadInformation?: React.ReactNode;
  disableModalDismiss?: boolean;
  setMainDrawerOpen: (open: boolean) => void;
  mainDrawerOpen: boolean;
  position: Position;
  setPosition: (position: Position) => void;
  autoDeploy: boolean | undefined;
  product?: Product;
};

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  title,
  subtitle,
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
  autoDeploy,
  product,
}) => {
  const [deltaPosition, setDeltaPosition] = useState<number>(0);
  const [isControlled, setIsControlled] = useState<boolean>(true);

  const leadModuleButtonRef = useRef<HTMLButtonElement>(null);
  const [collapsedDrawerRef, { height }] = useElementSize();
  const { topHeight, bottomHeight } = useHeights();
  const videoRef = useRef<HTMLVideoElement>(null);
  const handle = useFullScreenHandle();

  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.bottomDrawer',
  });
  const {
    retractDrawer,
    setRetractDrawer,
    appZoom,
    brandTheme,
    isPreviewMode,
    setCollapsedDrawerHeight,
    autoDeployTriggered,
    setAutoDeployTriggered,
    authFetched,
    registeringProduct,
  } = useGlobal();

  useEffect(() => {
    if (height) setCollapsedDrawerHeight(height);
  }, [height, setCollapsedDrawerHeight]);

  useEffect(() => {
    if (isPreviewMode) {
      if (isChildOpen) {
        setPosition({ ...position, y: topHeight });
      } else {
        setPosition({ ...position, y: bottomHeight });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChildOpen, topHeight, bottomHeight, isPreviewMode, appZoom]);

  useEffect(() => {
    if (position.y === topHeight) {
      setMainDrawerOpen(true);
    } else if (position.y === bottomHeight) {
      setMainDrawerOpen(false);
      closeChild();
    }
  }, [position, topHeight, bottomHeight, closeChild, setMainDrawerOpen]);

  useEffect(() => {
    if (!authFetched) return;
    if (registeringProduct) return;
    if (product?.registeredToCurrentUser) return;
    if (autoDeploy && buttons && buttons.length > 0) {
      setTimeout(() => {
        !autoDeployTriggered &&
          leadModuleButtonRef.current &&
          leadModuleButtonRef.current.click();
        setAutoDeployTriggered(true);
      }, 500);
    }
  }, [
    buttons,
    product,
    autoDeploy,
    authFetched,
    registeringProduct,
    autoDeployTriggered,
    setAutoDeployTriggered,
    leadModuleButtonRef.current,
  ]);

  const handleDrawerClose = useCallback(() => {
    setPosition({ ...position, y: bottomHeight });
    setMainDrawerOpen(false);
  }, [position, setPosition, bottomHeight, setMainDrawerOpen]);

  const handleStart = useCallback(() => {
    setIsControlled(false);
  }, []);

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ ...position, y: data.y });
    setDeltaPosition(data.deltaY);
  };

  const validateSocials = (socials: SocialsType) => {
    return socials?.email ||
      socials?.facebook ||
      socials?.instagram ||
      socials?.phone ||
      socials?.twitter ||
      socials?.tiktok
      ? true
      : false;
  };

  const handleStop = useCallback(() => {
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
  }, [topHeight, bottomHeight, deltaPosition, position, setPosition]);

  const renderVideoElement = (src: string) => {
    if (isDesktop) {
      return (
        <Wrapper
          width={handle.active ? '100%' : '0'}
          height='100%'
          alignItems='center'
          justifyContent='center'
        >
          <FullScreen
            handle={handle}
            onChange={(active) => {
              active ? videoRef.current?.play() : videoRef.current?.pause();
            }}
          >
            <video
              src={src}
              ref={videoRef}
              controls
              width='100%'
              height='100%'
              preload='metadata'
              playsInline={false}
              onEnded={() => handle.active && handle.exit()}
            />
          </FullScreen>
        </Wrapper>
      );
    } else if (isAndroid) {
      return (
        <Wrapper width='0' height='0'>
          <FullScreen handle={handle}>
            <video
              src={src}
              ref={videoRef}
              onPlay={() => handle.enter()}
              onEnded={() => handle.exit()}
              controls
              height='100%'
              width='100%'
              preload='metadata'
              playsInline={false}
            />
          </FullScreen>
        </Wrapper>
      );
    } else {
      return (
        <Wrapper width='0' height='0'>
          <video
            src={src}
            ref={videoRef}
            controls
            height={0}
            width='100%'
            preload='metadata'
            playsInline={false}
          />
        </Wrapper>
      );
    }
  };

  const drawerFooter = (
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
      {socials?.tiktok && (
        <DrawerIconLink
          href={
            socials?.tiktok.includes('https://') ||
            socials?.tiktok.includes('http://')
              ? socials?.tiktok
              : `https://${socials?.tiktok}`
          }
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image src={tiktokIcon} alt='tiktok-icon' />
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
  );

  return (
    <>
      <DrawerMask
        isDrawerOpen={!!mainDrawerOpen}
        onTouchEnd={() => handleDrawerClose()}
        onClick={() => handleDrawerClose()}
      />
      <Draggable
        axis='y'
        bounds={{ top: topHeight, bottom: bottomHeight }}
        position={position}
        onStart={handleStart}
        onDrag={handleDrag}
        onStop={handleStop}
        cancel='a, button, .not-draggable'
        disabled={disableModalDismiss}
      >
        <Drawer
          isControlled={isControlled}
          style={isPreviewMode ? { height: `88%` } : {}}
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
              <Wrapper direction='column' width='100%'>
                {!isChildOpen && (
                  <Wrapper
                    justifyContent='space-between'
                    alignItems='center'
                    width='100%'
                  >
                    <Wrapper
                      gap='2px'
                      width='65%'
                      height='100%'
                      alignSelf={subtitle ? 'flex-end' : 'center'}
                      justifyContent='space-between'
                      direction='column'
                    >
                      {title && (
                        <LinesEllipsis
                          trimRight
                          text={title ? title : ''}
                          maxLine={subtitle ? 1 : 2}
                          basedOn='words'
                          ellipsis='...'
                          style={{
                            width: '100%',
                            fontSize: '1rem',
                            fontWeight: '600',
                            lineHeight: '20px',
                          }}
                        />
                      )}
                      {subtitle && (
                        <Text fontSize='0.75rem' color='#636369'>
                          <p>{subtitle}</p>
                        </Text>
                      )}
                    </Wrapper>
                    {mainDrawerOpen ? null : leadInformation}
                  </Wrapper>
                )}
              </Wrapper>
            </DrawerHeader>
            {mainDrawerOpen && !disableModalDismiss && (
              <DrawerClose
                className='close-expanded-bottom-container-btn'
                onClick={() => {
                  if (isChildOpen) {
                    closeChild(true);
                    if (retractDrawer) handleDrawerClose();
                  } else handleDrawerClose();
                }}
              >
                <Close />
              </DrawerClose>
            )}
            <DrawerBody>
              <DragBar />
              {!mainDrawerOpen && (
                <Wrapper
                  gap='1rem'
                  width='100%'
                  direction='column'
                  ref={collapsedDrawerRef}
                  margin={isChildOpen ? '5.25rem 0 0 0' : '0'}
                >
                  {buttons?.length === 0 && isPreviewMode && (
                    <Button
                      className='expand-main-module-btn'
                      key='call-to-action'
                      brandTheme={brandTheme}
                      variant='dark'
                    >
                      {t('callToActionButton')}
                    </Button>
                  )}
                  {buttons?.map((button, index) => {
                    return (
                      index < (buttons.length > 2 ? 1 : 2) && (
                        <>
                          {button.moduleType === 'VIDEO_MODULE' ? (
                            <Button
                              brandTheme={brandTheme}
                              variant={button.isHighlight ? 'dark' : 'light'}
                              onClick={() => {
                                setRetractDrawer(false);
                                if (!button.locked) {
                                  isDesktop && handle.enter();
                                  videoRef.current?.play();
                                } else {
                                  setPosition({ ...position, y: topHeight });
                                  setRetractDrawer(true);
                                  button.onClick();
                                }
                              }}
                            >
                              {button.title}
                              {!button.locked &&
                                renderVideoElement(button.moduleData || '')}
                            </Button>
                          ) : (
                            <Button
                              className='expand-main-module-btn'
                              ref={leadModuleButtonRef}
                              key={button.title}
                              brandTheme={brandTheme}
                              variant={index === 0 ? 'dark' : 'light'}
                              inlineIcon
                              onClick={() => {
                                if (button.icon === null) {
                                  setPosition({ ...position, y: topHeight });
                                  setRetractDrawer(true);
                                }
                                button.onClick();
                              }}
                            >
                              {button.title}
                              {button.icon}
                            </Button>
                          )}
                        </>
                      )
                    );
                  })}
                  {buttons && buttons.length !== 2 && (
                    <Button
                      className='expand-options-btn'
                      variant='light'
                      brandTheme={brandTheme}
                      onClick={() => {
                        setPosition({ ...position, y: topHeight });
                        setRetractDrawer(false);
                      }}
                    >
                      {t('moreButton')}
                    </Button>
                  )}
                </Wrapper>
              )}
              {mainDrawerOpen &&
                (isChildOpen ? (
                  <>
                    <DragZone id='draggable' style={{ zIndex: 99 }} />
                    <div
                      className='not-draggable'
                      style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'auto',
                      }}
                    >
                      {children}
                    </div>
                  </>
                ) : (
                  <Wrapper width='100%' direction='column' gap='1rem'>
                    {buttons?.map((button) => {
                      return button.moduleType === 'VIDEO_MODULE' ? (
                        <Button
                          brandTheme={brandTheme}
                          variant={button.isHighlight ? 'dark' : 'light'}
                          onClick={() => {
                            setRetractDrawer(false);
                            if (!button.locked) {
                              isDesktop && handle.enter();
                              videoRef.current?.play();
                            } else button.onClick();
                          }}
                        >
                          {button.title}
                          {!button.locked &&
                            renderVideoElement(button.moduleData || '')}
                        </Button>
                      ) : (
                        <Button
                          className={
                            button.isHighlight
                              ? 'expand-main-module-btn'
                              : 'expand-submodule-btn'
                          }
                          key={button.title}
                          brandTheme={brandTheme}
                          variant={button.isHighlight ? 'dark' : 'light'}
                          inlineIcon
                          onClick={() => {
                            button.onClick();
                            setRetractDrawer(false);
                          }}
                        >
                          {button.title}
                          {button.icon}
                        </Button>
                      );
                    })}
                  </Wrapper>
                ))}
            </DrawerBody>
            {!isChildOpen && validateSocials(socials) && drawerFooter}
          </Wrapper>
        </Drawer>
      </Draggable>
    </>
  );
};

export default BottomDrawer;
