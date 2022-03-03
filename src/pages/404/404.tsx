import React, { useMemo } from 'react';
import { theme } from 'styles/theme';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'context/global/GlobalContext';
import Text from 'components/Text';
import Image from 'components/Image';
import Button from 'components/Button';
import Wrapper from 'components/Wrapper';
import PageHeader from 'components/PageHeader';
import IconButton from 'components/IconButton';
import brijLogo from 'assets/logos/svg/brij-colored.svg';
import background from 'assets/icons/svg/404-background.svg';
import externalLink from 'assets/icons/svg/external-link.svg';

const FourZeroFour: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'fourZeroFour' });
  const { setIsMenuOpen } = useGlobal();

  const menuButton = useMemo(
    () => (
      <Wrapper width='100%' justifyContent='flex-end'>
        <IconButton
          variant='dark'
          iconName='menu'
          onClick={() => setIsMenuOpen(true)}
        />
      </Wrapper>
    ),
    [setIsMenuOpen]
  );

  return (
    <>
      <Helmet>
        <title>{t('pageTitle')}</title>
      </Helmet>
      <Wrapper
        width='100%'
        height='100%'
        direction='column'
        justifyContent='flex-start'
        position='relative'
        alignItems='center'
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPositionY: '60px',
        }}
      >
        <PageHeader
          transparent
          border={false}
          actionButton={menuButton}
          logo={<Image width='auto' src={brijLogo} alt='brij-logo' />}
        />
        <Wrapper
          height='100%'
          direction='column'
          justifyContent='flex-end'
          padding='0 2rem 5rem 2rem'
        >
          <Wrapper
            gap='1.875rem'
            direction='column'
            alignItems='center'
            alignSelf='flex-end'
          >
            <h3>{t('message')}</h3>
            <Button
              squared
              width='190px'
              variant='light'
              onClick={() => window.open(t('learnMoreLink'), '_blank')}
            >
              <Text padding='0 0.5rem 0 0' color={theme.primary}>
                <p>{t('learnMoreButton')}</p>
              </Text>
              <Image src={externalLink} alt='external-link' />
            </Button>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </>
  );
};

export default FourZeroFour;
