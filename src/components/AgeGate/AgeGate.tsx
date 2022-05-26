import React, { useState } from 'react';
import { useGlobal } from 'context/global/GlobalContext';
import { useTranslation } from 'react-i18next';
import { Animated } from 'react-animated-css';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Text from 'components/Text';

const AgeGate: React.FC = () => {
  const [warningDisplay, setWarningDisplay] = useState<boolean>(false);
  const { agegateDisplay, toggleAgegateDisplay, brandTheme } = useGlobal();
  const { t } = useTranslation('translation', {
    keyPrefix: 'productDetails.ageGate',
  });

  return (
    <Animated
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationInDuration={400}
      animationOutDuration={0}
      animationInDelay={300}
      isVisible={
        agegateDisplay && localStorage.getItem('ageGateChecked') !== 'true'
      }
      style={{
        zIndex: 9999,
        width: '100%',
        height: '100vh',
        padding: '2rem',
        position: 'absolute',
        background: 'rgba(256, 256, 256, 1)',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Wrapper
        width='100%'
        gap='0.5rem'
        position='relative'
        direction='column'
        padding='1.25rem'
        paddingTop='1.25rem'
        alignItems='center'
        justifyContent='center'
      >
        <Text
          fontSize='1.5rem'
          color='#202029'
          fontWeight='500'
          textAlign='center'
          textTransform='uppercase'
        >
          <h4>{t('title')}</h4>
        </Text>
        <Text
          fontSize='0.875rem'
          fontWeight='500'
          color='#636369'
          textAlign='center'
        >
          <p>{t('subtitle')}</p>
        </Text>
      </Wrapper>
      <Wrapper
        position='relative'
        gap='0.75rem'
        width='100%'
        direction='column'
        alignItems='center'
        justifyContent='center'
        margin='1.25rem 0'
      >
        <Button
          variant='dark'
          brandTheme={brandTheme}
          onClick={() => {
            toggleAgegateDisplay(false);
            localStorage.setItem('ageGateChecked', JSON.stringify(true));
          }}
        >
          {t('confirmationButton')}
        </Button>
        <Button
          variant='light'
          brandTheme={brandTheme}
          onClick={() => setWarningDisplay(true)}
        >
          {t('disapprovalButton')}
        </Button>
        <Animated
          isVisible={warningDisplay}
          animationIn='headShake'
          animationOut='slideOutDown'
          animationInDuration={300}
          animationOutDuration={0}
        >
          <Text
            color='#FD6157'
            fontSize='0.875rem'
            fontWeight='500'
            textAlign='center'
          >
            <p>{t('warningMessage')}</p>
          </Text>
        </Animated>
      </Wrapper>
    </Animated>
  );
};

export default AgeGate;
