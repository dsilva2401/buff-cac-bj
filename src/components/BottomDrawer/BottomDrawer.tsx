import React, { useEffect, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import Text from "components/Text";
import Image from "components/Image";
import Button from "components/Button";
import DrawerMask from "components/DrawerMask";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerIconLink,
} from "./styles";
import { ReactComponent as Close } from "assets/icons/svg/close.svg";
import phoneCallIcon from "assets/icons/svg/social_phone-call.svg";
import emailIcon from "assets/icons/svg/social_email.svg";
import twitterIcon from "assets/icons/svg/social_twitter.svg";
import instagramIcon from "assets/icons/svg/social_instagram.svg";
import facebookIcon from "assets/icons/svg/social_facebook.svg";
import Wrapper from "components/Wrapper";

type BottomDrawerProps = {
  title: string;
  children: React.ReactNode;
  isChildOpen: boolean;
  closeChild: () => void;
  buttons: { title: string; onClick(): void; isHighlight: boolean }[];
};

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  title,
  children,
  isChildOpen,
  closeChild,
  buttons,
}) => {
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
        axis="y"
        bounds={{ top: topHeight, bottom: bottomHeight }}
        position={position}
        onStart={handleStart}
        onDrag={handleDrag}
        onStop={handleStop}
        cancel="a, button, #not-draggable"
      >
        <Drawer isControlled={isControlled}>
          <Wrapper
            width="100%"
            height="100%"
            direction="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <DrawerHeader>
              <Text fontSize="1rem" fontWeight="600">
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
            <DrawerBody id="not-draggable">
              {!isDrawerOpen && (
                <>
                  {buttons.map((button) => {
                    if (button.isHighlight) {
                      return (
                        <Button
                          theme="dark"
                          onClick={() => {
                            setPosition({ ...position, y: topHeight });
                            button.onClick();
                          }}
                        >
                          {button.title}
                        </Button>
                      );
                    }
                    return <></>;
                  })}
                  <Button
                    theme="light"
                    onClick={() => setPosition({ ...position, y: topHeight })}
                  >
                    More
                  </Button>
                </>
              )}
              {isDrawerOpen ? (
                isChildOpen ? (
                  children
                ) : (
                  buttons.map((button) => {
                    return (
                      <Button
                        key={button.title}
                        theme={button.isHighlight ? "dark" : "light"}
                        onClick={() => button.onClick()}
                      >
                        {button.title}
                      </Button>
                    );
                  })
                )
              ) : (
                <></>
              )}
            </DrawerBody>
            {!isChildOpen && (
              <DrawerFooter>
                <DrawerIconLink href="tel:+">
                  <Image src={phoneCallIcon} alt="Phone icon" />
                </DrawerIconLink>
                <DrawerIconLink href="mailto:">
                  <Image src={emailIcon} alt="Envelope icon" />
                </DrawerIconLink>
                <DrawerIconLink
                  href="http://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src={twitterIcon} alt="Twitter icon" />
                </DrawerIconLink>
                <DrawerIconLink
                  href="http://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src={instagramIcon} alt="Instagram Icon" />
                </DrawerIconLink>
                <DrawerIconLink
                  href="http://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src={facebookIcon} alt="Facebook icon" />
                </DrawerIconLink>
              </DrawerFooter>
            )}
          </Wrapper>
        </Drawer>
      </Draggable>
    </>
  );
};

export default BottomDrawer;
