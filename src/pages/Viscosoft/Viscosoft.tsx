import React from 'react';
import { theme } from 'styles/theme';
import { Helmet } from 'react-helmet';
import topStripe from 'assets/images/svg/top-stripe.svg';
import placeholder from 'assets/images/png/placeholder.png';
import checkmark from 'assets/icons/svg/checkmark-white.svg';
import bottomStripe from 'assets/images/svg/bottom-stripe.svg';
import horizontalStripe from 'assets/images/svg/horizontal-stripe.svg';
import viscosoftBackground from 'assets/images/svg/viscosoft-background.svg';
import viscosoftLogo from 'assets/logos/svg/viscosoft-logo.svg';
import ProgressiveImage from 'react-progressive-image';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';

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
          textAlign='left'
          fontWeight='600'
          fontSize='1.125rem'
          color='rgba(256, 256, 256, 0.9)'
        >
          <h2>
            Register and watch your product care video to get 12 months of FREE accident protection
          </h2>
        </Text>
        <Text
          fontWeight='500'
          fontSize='0.875rem'
          color='#FFFFFF'
        >
          <p>What's covered:</p>
          <Wrapper margin='0.25rem 0' alignItems='flex-start'>
            <Image src={checkmark} margin='0 0.375rem 0 0' />
            <span>Stains from food, drinks &#38; pen ink</span>
          </Wrapper>
          <Wrapper margin='0.25rem 0' alignItems='flex-start'>
            <Image src={checkmark} margin='0 0.375rem 0 0' />
            <span>Stains from human &#38; pet bodily fluids</span>
          </Wrapper>
          <Wrapper margin='0.25rem 0' alignItems='flex-start'>
            <Image src={checkmark} margin='0 0.375rem 0 0' />
            <span>Accidental rips &#38; tears</span>
          </Wrapper>
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
