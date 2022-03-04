import Wrapper from 'components/Wrapper';
import { ReactComponent as LoadingAnimation } from 'assets/icons/svg/loading.svg';
import { useGlobal } from 'context/global/GlobalContext';
import { theme } from 'styles/theme';

const LoadingIndicator = () => {
  const { brandTheme } = useGlobal();

  return (
    <Wrapper
      width='100%'
      height='100%'
      direction='column'
      justifyContent='center'
      alignItems='center'
    >
      <LoadingAnimation
        stroke={brandTheme || theme.primary}
        width='100%'
        height='60px'
      />
    </Wrapper>
  );
};

export default LoadingIndicator;
