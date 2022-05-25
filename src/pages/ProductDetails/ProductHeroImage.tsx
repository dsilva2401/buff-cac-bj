import Image from 'components/Image';
import Wrapper from 'components/Wrapper';
import { useGlobal } from 'context/global/GlobalContext';
import { Animated } from 'react-animated-css';
import ProgressiveImage from 'react-progressive-image';

const ProductHeroImage = () => {
  const { productDetails, appZoom, collapsedDrawerHeight } = useGlobal();

  if (!productDetails) {
    return null;
  }

  const backgroundColor = productDetails.brand?.customBgColor || 'white';
  const { name } = productDetails.brand;
  const imageSrc = productDetails.product?.image || '';

  return (
    <ProgressiveImage src={imageSrc} placeholder=''>
      {(src: string, loading: boolean) => {
        return loading ? (
          <Wrapper width='100%' height='100%' background={backgroundColor} />
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
  );
};

export default ProductHeroImage;
