import React, { useState, useEffect } from 'react';
import { useAPI } from 'utils/api';
import { Helmet } from 'react-helmet';
import { LandingHtmlWrapper } from './styles';
import { LandingPageType } from 'types/LandingPageType';
import topStripe from 'assets/images/svg/top-stripe.svg';
import LoadingIndicator from 'components/LoadingIndicator';
import placeholder from 'assets/images/png/placeholder.png';
import bottomStripe from 'assets/images/svg/bottom-stripe.svg';
import horizontalStripe from 'assets/images/svg/horizontal-stripe.svg';
import viscosoftBackground from 'assets/images/svg/viscosoft-background.svg';
import viscosoftLogo from 'assets/logos/svg/viscosoft-logo.svg';
import ProgressiveImage from 'react-progressive-image';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';

const Landing: React.FC = () => {
  const [pageData, setPageData] = useState<LandingPageType | null>(null);
  const [fetchData, loading] = useAPI({
    method: 'GET',
    endpoint: `lading/page/viscosoft`,
    onSuccess: ((response) => {
      console.log("Response: ", response);
      setPageData(response);
    }),
    onError: ((error) => console.log("Error: ", error))
  }, null, false);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {pageData ? pageData[0]?.brand[0]?.name : 'Loading...'}
        </title>
      </Helmet>
      {loading || !pageData ? <LoadingIndicator /> :
        <>
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

          <Wrapper left='0' top='2.75rem' position='absolute' zIndex={1}>
            <Image width='150px' src={viscosoftLogo} alt='brand-logo' />
            {/* viscosoft specific */}
            <Image position='absolute' src={topStripe} left='168px' top='-99px' />
            <Image src={horizontalStripe} position='absolute' left='167px' />
            <Image
              src={horizontalStripe}
              position='absolute'
              left='167px'
              top='41px'
            />
            <Image src={bottomStripe} position='absolute' left='168px' top='42px' />
            {/* viscosoft specific */}
          </Wrapper>

          <Wrapper
            zIndex={3}
            width='100%'
            height='100%'
            gap='0.75rem'
            padding='1.5rem'
            direction='column'
            position='relative'
            margin='6rem 0 0 0'
            alignItems='flex-start'
            justifyContent='center'
          >
            <LandingHtmlWrapper
              dangerouslySetInnerHTML={{ __html: pageData[0]?.brand[0]?.details }}
            />
            {pageData[0]?.links?.map(node => (
              <Button
                key={node.title}
                variant='light'
                onClick={() => window.open(node.url, '_blank')}
              >
                <Text color='#1C3965'>
                  <p>{node.title}</p>
                </Text>
              </Button>
            ))}
          </Wrapper>
        </>
      }
    </>
  );
};

export default Landing;
