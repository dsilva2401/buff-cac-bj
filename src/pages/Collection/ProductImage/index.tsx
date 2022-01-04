import React from 'react';
import Image from 'components/Image';
import ProgressiveImage from 'react-progressive-image';
import placeholder from 'assets/images/png/collection-placeholder.png';
import { ProductDetailsType } from '../../../types/ProductDetailsType';
import { ProductCard } from '../styles';

type ProductImageProps = {
  item: ProductDetailsType;
  goToDetails: () => void;
};

const ProductImage: React.FC<ProductImageProps> = ({ item, goToDetails }) => {
  return (
    <ProductCard
      key={item?.product?.id}
      onClick={() => goToDetails()}
    >
      <ProgressiveImage src={item?.product?.image} placeholder={placeholder}>
        {(src: string, loading: boolean) => (
          <Image
            src={src}
            alt={item?.product?.name}
            opacity={loading ? 0.5 : 1}
            objectFit='contain'
            transition='0.3s'
          />
        )}
      </ProgressiveImage>
    </ProductCard>
  );
};

export default ProductImage;
