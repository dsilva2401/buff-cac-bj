import { useEffect } from 'react';
import Wrapper from 'components/Wrapper';

const VideoDrawer = ({ closeDrawer }: { closeDrawer: () => void }) => {
  useEffect(() => {
    closeDrawer();
  }, []);

  return <Wrapper width='100%' height='100%' />;
};

export default VideoDrawer;
