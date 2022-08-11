import React, {
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Position } from 'types/Misc';
import { SocialsType } from './DrawerFooter';
import { useTranslation } from 'react-i18next';
import { Product } from 'types/ProductDetailsType';
import { useGlobal } from 'context/global/GlobalContext';
import { isAndroid, isDesktop } from 'react-device-detect';
import { ReactComponent as Close } from 'assets/icons/svg/close.svg';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import AndroidPlayer from 'components/AndroidPlayer';
import useElementSize from 'hooks/useElementSize';
import LinesEllipsis from 'react-lines-ellipsis';
import DrawerMask from 'components/DrawerMask';
import useHeights from 'hooks/useHeights';
import DrawerFooter from './DrawerFooter';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Text from 'components/Text';
import {
  Drawer,
  DragBar,
  DragZone,
  DrawerBody,
  DrawerClose,
  DrawerHeader,
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
  const [videoSource, setVideoSource] = useState<string>('');

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
      if (isChildOpen) setPosition({ ...position, y: topHeight });
      else setPosition({ ...position, y: bottomHeight });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChildOpen, topHeight, bottomHeight, isPreviewMode, appZoom]);

  useEffect(() => {
    if (position.y === topHeight) {
      setMainDrawerOpen(true);
    } else if (position.y === bottomHeight) {
      setMainDrawerOpen(false);
      // whenever we close the drawer route back to main product route
      closeChild(true);
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

  const handleStart = useCallback(() => setIsControlled(false), []);

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
      if (position.y === bottomHeight)
        setPosition({ ...position, y: bottomHeight });
      else setPosition({ ...position, y: topHeight });
    }
  }, [topHeight, bottomHeight, deltaPosition, position, setPosition]);

  const renderVideoElement = (src: string) => {
    if (isAndroid || isPreviewMode) {
      return null;
    } else if (isDesktop) {
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

  return (
    <>
      <DrawerMask
        isDrawerOpen={!!mainDrawerOpen}
        onTouchEnd={() => handleDrawerClose()}
        onClick={() => handleDrawerClose()}
      />
      {videoSource !== '' && (
        <AndroidPlayer source={videoSource} setVideoSource={setVideoSource} />
      )}
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
          {!isChildOpen && (
            <DrawerHeader
              isDrawerOpen={mainDrawerOpen}
              isChildOpen={isChildOpen}
            >
              <Wrapper
                width='65%'
                height='100%'
                justifyContent='center'
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
                  <Text
                    color='#636369'
                    fontSize='0.75rem'
                    wrapperWidth='max-content'
                  >
                    <p>{subtitle}</p>
                  </Text>
                )}
              </Wrapper>
              {mainDrawerOpen ? null : leadInformation}
            </DrawerHeader>
          )}
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
                                isDesktop && !isPreviewMode && handle.enter();
                                (isPreviewMode || isAndroid) &&
                                  setVideoSource(button.moduleData || '');
                                (!isPreviewMode || !isAndroid) &&
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
                              !isPreviewMode &&
                              !isAndroid &&
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
                            isDesktop && !isPreviewMode && handle.enter();
                            (isPreviewMode || isAndroid) &&
                              setVideoSource(button.moduleData || '');
                            (!isPreviewMode || !isAndroid) &&
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
                          !isPreviewMode &&
                          !isAndroid &&
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
          {!isChildOpen && validateSocials(socials) && (
            <DrawerFooter
              phone={socials?.phone}
              email={socials?.email}
              twitter={socials?.twitter}
              instagram={socials?.instagram}
              facebook={socials?.facebook}
              tiktok={socials?.tiktok}
            />
          )}
        </Drawer>
      </Draggable>
    </>
  );
};

export default BottomDrawer;
