import React, { useEffect, useState } from 'react';
import { LandingPageType } from 'types/LandingPageType';
import { LandingHtmlWrapper } from './styles';
import { Helmet } from 'react-helmet';
import { useAPI } from 'utils/api';
import Image from 'components/Image';
import Button from 'components/Button';
import topStripe from 'assets/images/svg/top-stripe.svg';
import placeholder from 'assets/images/png/placeholder.png';
import bottomStripe from 'assets/images/svg/bottom-stripe.svg';
import viscosoftLogo from 'assets/logos/svg/viscosoft-logo.svg';
import horizontalStripe from 'assets/images/svg/horizontal-stripe.svg';
import viscosoftBackground from 'assets/images/svg/viscosoft-background.svg';
import LoadingIndicator from 'components/LoadingIndicator';
import ProgressiveImage from 'react-progressive-image';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';

const Landing: React.FC = () => {
  const [pageData, setPageData] = useState<LandingPageType | null>(null);
  const [fetchData, loading] = useAPI(
    {
      method: 'GET',
      endpoint: `landing/page/viscosoft`,
      onSuccess: (response) => setPageData(response),
      onError: (error) => console.log('Error: ', error),
    },
    null,
    false
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>{pageData ? pageData[0]?.brand[0]?.name : 'Loading...'}</title>
      </Helmet>
      {loading || !pageData ? (
        <LoadingIndicator />
      ) : (
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
            <Image
              position='absolute'
              src={topStripe}
              left='168px'
              top='-99px'
            />
            <Image src={horizontalStripe} position='absolute' left='167px' />
            <Image
              src={horizontalStripe}
              position='absolute'
              left='167px'
              top='41px'
            />
            <Image
              src={bottomStripe}
              position='absolute'
              left='168px'
              top='42px'
            />
            {/* viscosoft specific */}
          </Wrapper>

          <Wrapper
            zIndex={3}
            width='100%'
            gap='1.625rem'
            margin='6rem 0 0 0'
            padding='0 1.125rem 1.125rem 1.125rem'
            position='relative'
            direction='column'
            overflow='scroll'
          >
            <LandingHtmlWrapper
              style={{ marginTop: 'auto' }}
              dangerouslySetInnerHTML={{
                __html: pageData[0]?.brand[0]?.details,
              }}
            />
            <Wrapper
              width='100%'
              direction='column'
              margin='0 0 auto 0'
              gap='0.75rem'
            >
              {pageData[0]?.links?.map((node) => (
                <Button
                  key={node.title}
                  variant='light'
                  onClick={() =>
                    node.url.includes('https://') ||
                    node.url.includes('http://')
                      ? window.open(node.url, '_self')
                      : window.open(`https://${node.url}`, '_self')
                  }
                  style={{ border: '1px solid #1C3965' }}
                >
                  <Text color='#1C3965' fontWeight='600'>
                    <p>{node.title}</p>
                  </Text>
                </Button>
              ))}
            </Wrapper>
          </Wrapper>
        </>
      )}
    </>
  );
};

export default Landing;
