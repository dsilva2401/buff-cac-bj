import { isBrowser } from 'react-device-detect';
import { useGlobal } from 'context/global/GlobalContext';

const useHeights = () => {
  const { isPreviewMode, appZoom } = useGlobal();

  const topHeight = 0;
  let bottomHeight: number;
  let margin = 290;
  if (isBrowser || isPreviewMode) {
    if (window.innerHeight < 700) margin = 340;
    else if (window.innerHeight >= 700 && window.innerHeight < 800)
      margin = 350;
    else if (window.innerHeight >= 800 && window.innerHeight < 900)
      margin = 370;
    else if (window.innerHeight >= 900 && window.innerHeight < 1000)
      margin = 390;
    else if (window.innerHeight >= 1000) margin = window.innerHeight * 0.4;
  }

  if (isPreviewMode) {
    bottomHeight =
      window.innerHeight / appZoom - (window.innerHeight * 0.45) / appZoom;
  } else {
    bottomHeight = window.innerHeight - margin;
  }

  return { topHeight, bottomHeight };
};

export default useHeights;
