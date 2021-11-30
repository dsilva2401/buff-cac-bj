import React from 'react';
import Image from "components/Image";
import { ProductCard } from '../styles';
import { ProductDetailsType } from '../../../types/ProductDetailsType';

type ProductImageProps = {
  item: ProductDetailsType;
  goToDetails: () => void;
};

const ProductImage: React.FC<ProductImageProps> = ({ item, goToDetails }) => {
  return (
    <ProductCard
      key={item.product.id}
      registered={item.product.registered}
      onClick={() => goToDetails()}
    >
      <Image src={item.product.image} alt='product' />
    </ProductCard>
  );
};

export default ProductImage;
