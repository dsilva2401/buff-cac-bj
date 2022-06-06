import React, { useEffect, useState } from 'react';
import { LandingPageType } from 'types/LandingPageType';
import { LandingHtmlWrapper } from './styles';
import { Helmet } from 'react-helmet';
import { useAPI } from 'utils/api';
import Image from 'components/Image';
import Button from 'components/Button';
import placeholder from 'assets/images/png/placeholder.png';
import viscosoftLogo from 'assets/logos/svg/viscosoft-logo.svg';
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

          <Wrapper
            zIndex={3}
            width='100%'
            padding='2rem 1.25rem'
            position='relative'
            justifyContent='flex-start'
            direction='column'
            overflow='scroll'
          >
            <Image
              src={viscosoftLogo}
              alt='brand-logo'
              maxWidth='124px'
              margin='0 auto 1rem auto'
            />
            <LandingHtmlWrapper
              dangerouslySetInnerHTML={{
                __html: pageData[0]?.brand[0]?.details,
              }}
            />
            {pageData[0]?.links?.map((node) => (
              <Button
                key={node.title}
                variant='dark'
                margin='0.375rem 0'
                onClick={() =>
                  node.url.includes('https://') || node.url.includes('http://')
                    ? window.open(node.url, '_self')
                    : window.open(`https://${node.url}`, '_self')
                }
                style={{ background: '#243762' }}
              >
                <Text color='#FFFFFF' fontWeight='600'>
                  <p>{node.title}</p>
                </Text>
              </Button>
            ))}
          </Wrapper>
        </>
      )}
    </>
  );
};

export default Landing;
