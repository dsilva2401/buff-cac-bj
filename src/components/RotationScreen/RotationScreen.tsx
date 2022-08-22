import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import Lottie from 'react-lottie';
import rotationAnimationData from 'assets/lottie-animations/device-rotate-animation.json';
import { isBrowser } from 'react-device-detect';
import { useTranslation } from 'react-i18next';

const RotationScreen: React.FC = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'rotationScreen',
  });

  return (
    <Wrapper
      id={isBrowser ? 'hide' : 'landscape'}
      direction='column'
      padding='0 1.5rem'
      alignItems='center'
      justifyContent='center'
      margin='-2rem 0 0 0'
      gap='1rem'
    >
      <Text
        id={isBrowser ? 'hide' : 'landscape'}
        fontSize='18px'
        textAlign='center'
        wrapperWidth='70%'
      >
        <span>{t('message')}</span>
      </Text>
      <Lottie
        speed={1}
        options={{
          loop: true,
          autoplay: true,
          animationData: rotationAnimationData,
        }}
        height={80}
        width={80}
      />
    </Wrapper>
  );
};

export default RotationScreen;
