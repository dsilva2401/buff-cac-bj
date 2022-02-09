import placeholder from 'assets/images/png/placeholder.png';
import bottomStripe from 'assets/images/svg/bottom-stripe.svg';
import horizontalStripe from 'assets/images/svg/horizontal-stripe.svg';
import topStripe from 'assets/images/svg/top-stripe.svg';
import viscosoftBackground from 'assets/images/svg/viscosoft-background.svg';
import viscosoftLogo from 'assets/logos/svg/viscosoft-logo.svg';
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';
import Wrapper from 'components/Wrapper';
import React from 'react';
import { Helmet } from 'react-helmet';
import ProgressiveImage from 'react-progressive-image';
import { theme } from 'styles/theme';

const Viscosoft: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>ViscoSoft</title>
      </Helmet>
      <ProgressiveImage src={viscosoftBackground} placeholder={placeholder}>
        {(src: string, loading: boolean) => (
          <Image
            src={src}
            alt='background'
            position='absolute'
            width='100vw'
            margin='auto'
            objectFit='cover'
            transition='0.3s'
            opacity={loading ? 0.5 : 1}
            style={{ minHeight: '100%', minWidth: '100%' }}
          />
        )}
      </ProgressiveImage>
      <Wrapper left='0' top='2.75rem' position='absolute' style={{ zIndex: 1 }}>
        <Image width='150px' src={viscosoftLogo} alt='viscosoft-logo' />
        <Image position='absolute' src={topStripe} left='150px' top='-100px' />
        <Image src={horizontalStripe} position='absolute' left='150px' />
        <Image
          src={horizontalStripe}
          position='absolute'
          left='150px'
          top='55px'
        />
        <Image src={bottomStripe} position='absolute' left='150px' top='55px' />
      </Wrapper>
      <Wrapper
        width='100%'
        height='100%'
        gap='0.75rem'
        padding='1.25rem'
        direction='column'
        position='relative'
        alignItems='flex-start'
        justifyContent='center'
        background='rgba(0, 0, 0, 0.4)'
      >
        <Text
          color='#FFFFFF'
          textAlign='left'
          fontSize='1.125rem'
          fontWeight='600'
          margin='0 0 1.5rem 0'
        >
          <h2>
            Register to get 12 months of FREE protection against accidents
          </h2>
        </Text>
        <Button
          variant='light'
          onClick={() => window.open('https://v2.brij.it/c/TN4Y', '_blank')}
        >
          <Text color={theme.primary}>
            <p>2” or 3” Reflex</p>
          </Text>
        </Button>
        <Button
          variant='light'
          onClick={() => window.open('https://v2.brij.it/c/3SPI', '_blank')}
        >
          <Text color={theme.primary}>
            <p>3” Select High Density</p>
          </Text>
        </Button>
        <Button
          variant='light'
          onClick={() => window.open('https://v2.brij.it/c/0Z3Q', '_blank')}
        >
          <Text color={theme.primary}>
            <p>4” Serene Hybrid</p>
          </Text>
        </Button>
        <Button
          variant='light'
          onClick={() => window.open('https://v2.brij.it/c/BIF3', '_blank')}
        >
          <Text color={theme.primary}>
            <p>4” Active Cooling</p>
          </Text>
        </Button>
      </Wrapper>
    </>
  );
};

export default Viscosoft;
