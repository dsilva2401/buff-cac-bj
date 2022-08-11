import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as PauseCircle } from 'assets/icons/svg/pause-circle.svg';
import { ReactComponent as PlayCircle } from 'assets/icons/svg/play-circle.svg';
import { ReactComponent as SpeakerIcon } from 'assets/icons/svg/speaker.svg';
import { ReactComponent as MuteIcon } from 'assets/icons/svg/mute.svg';
import { ReactComponent as Close } from 'assets/icons/svg/close.svg';
import { DrawerClose } from 'components/BottomDrawer/styles';
import { RangeInput, PlayButton } from './styles';
import { Animated } from 'react-animated-css';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import useElementSize from 'hooks/useElementSize';

interface AndroidPlayerProps {
  source: string;
  setVideoSource: React.Dispatch<React.SetStateAction<string>>;
}

const AndroidPlayer: React.FC<AndroidPlayerProps> = ({
  source,
  setVideoSource,
}) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(false);
  const [counter, setCounter] = useState<number | null>(null);
  const [showControls, toggleControls] = useState<boolean>(false);
  const [videoWrapperRef, { height }] = useElementSize();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (counter === 0) setCounter(null);
    if (!counter) toggleControls(false);

    const intervalId = setInterval(() => {
      if (counter) setCounter(counter - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [counter]);

  const resetCounter = () => setCounter(4);

  const handleVideoProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetCounter();
    if (videoRef.current) {
      const manualChange = Number(event.target.value);
      videoRef.current.currentTime =
        (videoRef.current.duration / 100) * manualChange;
      setProgress(manualChange);
    }
  };

  const handleOnTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  return (
    <Wrapper
      position='absolute'
      width='100%'
      height='100%'
      top='0'
      left='0'
      zIndex={100}
      background='black'
      direction='column'
      justifyContent='center'
      alignItems='center'
    >
      <DrawerClose
        onClick={() => {
          videoRef.current?.pause();
          setVideoSource('');
        }}
      >
        <Close />
      </DrawerClose>
      <Wrapper
        ref={videoWrapperRef}
        onClick={() => {
          if (!showControls) {
            toggleControls(true);
            resetCounter();
          }
        }}
      >
        <video
          autoPlay
          src={source}
          ref={videoRef}
          controls={false}
          muted={muted}
          height='auto'
          width='100%'
          preload='metadata'
          playsInline={true}
          onTimeUpdate={handleOnTimeUpdate}
          onPlay={() => {
            setPlaying(true);
            resetCounter();
          }}
          onPause={() => setPlaying(false)}
        />
      </Wrapper>
      {videoRef?.current && (
        <Animated
          isVisible={showControls}
          animationIn='fadeIn'
          animationOut='fadeOut'
          animationInDuration={300}
          animationOutDuration={800}
          style={{ width: '100%' }}
          animateOnMount={false}
        >
          <Wrapper
            position='relative'
            width='100%'
            height={`${height}px`}
            direction='column'
            alignItems='center'
            padding='0.5rem 1rem'
            gap='0.25rem'
            justifyContent='flex-end'
            background='linear-gradient(180deg, rgba(255,255,255,0) 75%, rgba(0,0,0,0.75) 100%)'
            onClick={(event) => {
              event.stopPropagation();
              toggleControls(!showControls);
            }}
          >
            <PlayButton
              type='button'
              onClick={(event) => {
                event.stopPropagation();
                resetCounter();
                playing ? videoRef.current?.pause() : videoRef.current?.play();
              }}
            >
              {playing ? (
                <PauseCircle width={80} fill='white' />
              ) : (
                <PlayCircle width={80} fill='white' />
              )}
            </PlayButton>
            <Wrapper
              width='100%'
              direction='row'
              alignItems='center'
              justifyContent='space-between'
            >
              <Text
                color='#FFFFFF'
                fontSize='0.75rem'
                wrapperWidth='max-content'
                textAlign='left'
              >
                {videoRef?.current?.duration && (
                  <p>
                    {videoRef?.current?.currentTime
                      ? new Date(videoRef.current.currentTime * 1000)
                          .toISOString()
                          .slice(14, 19)
                      : '00:00'}
                    {' / '}
                    {new Date(videoRef?.current?.duration * 1000)
                      .toISOString()
                      .slice(14, 19)}
                  </p>
                )}
              </Text>
              {muted ? (
                <MuteIcon
                  fill='white'
                  width={20}
                  height={20}
                  onClick={(event) => {
                    event.stopPropagation();
                    setMuted(!muted);
                    resetCounter();
                  }}
                />
              ) : (
                <SpeakerIcon
                  fill='white'
                  width={20}
                  height={20}
                  onClick={(event) => {
                    event.stopPropagation();
                    setMuted(!muted);
                    resetCounter();
                  }}
                />
              )}
            </Wrapper>
            <Wrapper
              width='100%'
              height='20px'
              borderRadius='4px'
              style={{ overflowX: 'hidden', overflowY: 'visible' }}
            >
              <RangeInput
                min='0'
                max='100'
                type='range'
                value={progress}
                onChange={handleVideoProgress}
                onInput={resetCounter}
              />
            </Wrapper>
          </Wrapper>
        </Animated>
      )}
    </Wrapper>
  );
};

export default AndroidPlayer;
