import { useState, useEffect, useRef } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { VideoModuleType } from 'types/ProductDetailsType';
import { isDesktop } from 'react-device-detect';
import Wrapper from 'components/Wrapper';

const VideoDrawer = ({
  drawerData,
  closeDrawer,
  isDrawerPageOpen,
}: {
  drawerData: VideoModuleType;
  closeDrawer: () => void;
  isDrawerPageOpen: boolean;
}) => {
  const [awaitClose, setAwaitClose] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const handle = useFullScreenHandle();

  useEffect(() => {
    if (isDesktop) {
      if (handle.active) {
        handle.exit();
        videoRef.current?.pause();
        setAwaitClose(false);
        closeDrawer();
      } else {
        handle.enter();
        videoRef.current?.play();
        setAwaitClose(true);
      }
    } else videoRef.current?.play();
  }, []);

  useEffect(() => {
    if (awaitClose && handle.active === false) {
      closeDrawer();
    }
  }, [handle]);

  videoRef?.current?.addEventListener(
    'webkitendfullscreen',
    () => videoExitedFullscreen(),
    false
  );

  const videoExitedFullscreen = () => {
    closeDrawer();
  };

  let video = isDesktop ? (
    <FullScreen handle={handle}>
      <Wrapper
        width={handle.active ? '100%' : '0'}
        height='100%'
        alignItems='center'
        justifyContent='center'
      >
        <video
          ref={videoRef}
          controls={false}
          width='100%'
          height='100%'
          preload='metadata'
          playsInline={false}
          onEnded={() => {
            isDesktop && handle.exit();
            closeDrawer();
          }}
          src={drawerData.path}
        />
      </Wrapper>
    </FullScreen>
  ) : (
    <Wrapper width='0' height='0'>
      <video
        ref={videoRef}
        controls={false}
        width='100%'
        preload='metadata'
        playsInline={false}
        onEnded={() => closeDrawer()}
        src={drawerData.path}
      />
    </Wrapper>
  );

  return isDrawerPageOpen ? (
    <Wrapper width='100%' height='100%'>
      {video}
    </Wrapper>
  ) : null;
};

export default VideoDrawer;
