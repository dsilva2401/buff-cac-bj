import Image from 'components/Image';
import Wrapper from 'components/Wrapper';
import { useGlobal } from 'context/global/GlobalContext';
import { Fragment, useState } from 'react';
import { Animated } from 'react-animated-css';
import ProgressiveImage from 'react-progressive-image';

const ProductHeroImage = () => {
  const { productDetails, appZoom, collapsedDrawerHeight } = useGlobal();
  const backgroundColor = productDetails?.brand?.customBgColor || 'white';
  const name = productDetails?.brand?.name;
  const imageSrc = productDetails?.product?.image || '';
  let optimizedImageSrc = imageSrc;
  let thumbnailSrc = '';
  if (!imageSrc.match(/shopify/gi)) {
    const fileId = imageSrc
      .split('?')
      .shift()
      ?.split('/')
      .pop()
      ?.split('.')
      .shift();
    thumbnailSrc = `${
      process.env.REACT_APP_API_URL || ''
    }/optimized-images/${fileId}/thumbnail.webp`;
    optimizedImageSrc = `${
      process.env.REACT_APP_API_URL || ''
    }/optimized-images/${fileId}/1000x1000.webp`;
  }
  const [renderOptimizedImage, setRenderOptimizedImage] = useState(true);

  return (
    <Fragment>
      {!!productDetails && (
        <ProgressiveImage
          onError={() => {
            setRenderOptimizedImage(false);
          }}
          src={renderOptimizedImage ? optimizedImageSrc : imageSrc}
          placeholder={thumbnailSrc}
        >
          {(src: string, loading: boolean) => {
            return !!loading ? (
              <Wrapper width='100%' height='100%' background={backgroundColor}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    filter: 'blur(7px)',
                    background: `url(${src}) no-repeat center center`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </Wrapper>
            ) : (
              <Wrapper
                width='100%'
                height={`${window.innerHeight / appZoom}px`}
                padding={`0 0 ${collapsedDrawerHeight + 40}px 0`}
                background={backgroundColor}
              >
                <Animated isVisible animationIn='fadeIn' animationOut='fadeIn'>
                  <Image
                    src={src}
                    alt={name}
                    position='relative'
                    width='100%'
                    margin='auto'
                    objectFit='cover'
                    style={{ minHeight: '100%' }}
                  />
                </Animated>
              </Wrapper>
            );
          }}
        </ProgressiveImage>
      )}
    </Fragment>
  );
};

export default ProductHeroImage;
