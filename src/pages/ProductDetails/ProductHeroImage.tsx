import { Fragment, useState } from 'react';
import { Animated } from 'react-animated-css';
import { useGlobal } from 'context/global/GlobalContext';
import ProgressiveImage from 'react-progressive-image';
import Wrapper from 'components/Wrapper';
import Image from 'components/Image';

const ProductHeroImage = () => {
  const { productDetails, appZoom } = useGlobal();
  const backgroundColor = productDetails?.brand?.customBgColor || 'white';
  const name = productDetails?.brand?.name;
  const imageSrc = productDetails?.product?.image || '';
  let optimizedImageSrc = imageSrc;
  if (!imageSrc.match(/shopify/gi)) {
    const hostUrl = process.env.REACT_APP_HOST_URL_IMAGE || '';
    const fileId = imageSrc
      .split('?')
      .shift()
      ?.split('/')
      .pop()
      ?.split('.')
      .shift();
    optimizedImageSrc = `${hostUrl}/optimized-images/${fileId}/1000x1000.webp`;
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
          placeholder=''
        >
          {(src: string, loading: boolean) => {
            return !!loading ? (
              <Wrapper
                width='100%'
                height={`${window.innerHeight / appZoom}px`}
                background={backgroundColor}
                padding='0 0 168px 0'
              >
                <Image
                  src={optimizedImageSrc}
                  alt={name}
                  position='relative'
                  width='100%'
                  margin='auto'
                  objectFit='cover'
                  style={{ minHeight: '100%', filter: 'blur(7px)' }}
                />
              </Wrapper>
            ) : (
              <Wrapper
                width='100%'
                height={`${window.innerHeight / appZoom}px`}
                background={backgroundColor}
                padding='0 0 168px 0'
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
