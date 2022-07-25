import { isBrowser, isMobile, isIOS, isFirefox } from 'react-device-detect';
import { useGlobal } from 'context/global/GlobalContext';

const useHeights = () => {
  const { isPreviewMode, appZoom } = useGlobal();

  const topHeight = 0;
  let bottomHeight: number;
  let margin = 290;
  if (isBrowser || isMobile || isPreviewMode) {
    if (window.innerHeight < 550) margin = 300;
    else if (window.innerHeight >= 550 && window.innerHeight < 600)
      margin = 320;
    else if (window.innerHeight >= 600 && window.innerHeight < 650)
      margin = 330;
    else if (window.innerHeight >= 650 && window.innerHeight < 700)
      margin = 340;
    else if (window.innerHeight >= 700 && window.innerHeight < 750)
      margin = 350;
    else if (window.innerHeight >= 750 && window.innerHeight < 800)
      margin = 360;
    else if (window.innerHeight >= 800 && window.innerHeight < 850)
      margin = 370;
    else if (window.innerHeight >= 850 && window.innerHeight < 900)
      margin = 380;
    else if (window.innerHeight >= 900 && window.innerHeight < 950)
      margin = 390;
    else if (window.innerHeight >= 950 && window.innerHeight < 1000)
      margin = 405;
    else if (window.innerHeight >= 1000 && window.innerHeight < 1050)
      margin = 420;
    else if (window.innerHeight >= 1050 && window.innerHeight < 1100)
      margin = 430;
    else if (window.innerHeight >= 1100 && window.innerHeight < 1150)
      margin = 440;
    else if (window.innerHeight >= 1150 && window.innerHeight < 1200)
      margin = 450;
    else if (window.innerHeight >= 1200 && window.innerHeight < 1300)
      margin = window.innerHeight * 0.38;
    else if (window.innerHeight >= 1300 && window.innerHeight < 1500)
      margin = window.innerHeight * 0.36;
    else margin = window.innerHeight * 0.34;
  }

  if (isIOS && !isPreviewMode && !isFirefox) margin = margin - 60;

  if (isPreviewMode) bottomHeight = window.innerHeight / appZoom - 290;
  else bottomHeight = window.innerHeight - margin;

  return { topHeight, bottomHeight };
};

export default useHeights;
