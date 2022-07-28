import { isBrowser, isMobile, isIOS, isFirefox } from 'react-device-detect';
import { useGlobal } from 'context/global/GlobalContext';

const useHeights = () => {
  const { isPreviewMode, appZoom } = useGlobal();

  const topHeight = 0;
  let bottomHeight: number;
  let margin = 290;
  if (isBrowser || isMobile || isPreviewMode) {
    if (window.innerHeight < 550) margin = 290;
    else if (window.innerHeight >= 550 && window.innerHeight < 600)
      margin = 300;
    else if (window.innerHeight >= 600 && window.innerHeight < 650)
      margin = 310;
    else if (window.innerHeight >= 650 && window.innerHeight < 700)
      margin = 320;
    else if (window.innerHeight >= 700 && window.innerHeight < 800)
      margin = 330;
    else if (window.innerHeight >= 800 && window.innerHeight < 850)
      margin = 340;
    else if (window.innerHeight >= 850 && window.innerHeight < 950)
      margin = 350;
    else if (window.innerHeight >= 950 && window.innerHeight < 1000)
      margin = 360;
    else if (window.innerHeight >= 1000 && window.innerHeight < 1050)
      margin = 365;
    else if (window.innerHeight >= 1050 && window.innerHeight < 1100)
      margin = 375;
    else if (window.innerHeight >= 1100 && window.innerHeight < 1150)
      margin = 380;
    else if (window.innerHeight >= 1150 && window.innerHeight < 1200)
      margin = 390;
    else if (window.innerHeight >= 1200 && window.innerHeight < 1400)
      margin = window.innerHeight * 0.32;
    else if (window.innerHeight >= 1400 && window.innerHeight < 1600)
      margin = window.innerHeight * 0.3;
    else margin = window.innerHeight * 0.27;
  }

  if (isMobile) margin = margin - 30;
  if (isPreviewMode) bottomHeight = window.innerHeight / appZoom - 280;
  else bottomHeight = window.innerHeight - margin;

  return { topHeight, bottomHeight };
};

export default useHeights;
