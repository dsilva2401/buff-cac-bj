import Wrapper from 'components/Wrapper';
import { ReactComponent as LoadingAnimation } from 'assets/icons/svg/loading.svg';
import { theme } from 'styles/theme';

const LoadingIndicator = () => {
  return (
    <Wrapper
      width='100%'
      height='100%'
      direction='column'
      justifyContent='center'
      alignItems='center'
    >
      <LoadingAnimation stroke={theme.primary} width='100%' height='60px' />
    </Wrapper>
  );
};

export default LoadingIndicator;
