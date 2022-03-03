import React from 'react';
import Text from 'components/Text';
import Image from 'components/Image';
import Wrapper from 'components/Wrapper';

type InfoDrawerProps = {
  product: any;
  closePage(): void;
  productInfo: any;
};

const InfoDrawer: React.FC<InfoDrawerProps> = ({
  product,
  closePage,
  productInfo,
}) => {
  return (
    <Wrapper
      width='100%'
      height='95%'
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      overflow='auto'
      gap='1rem'
      padding='1rem'
    >
      <Wrapper width='100%' justifyContent='center' alignItems='center'>
        <Image
          src={product?.image}
          alt='Product information'
          height='200px'
          rounded
        />
      </Wrapper>
      <Wrapper
        width='100%'
        direction='column'
        justifyContent='flex-start'
        alignItems='flex-start'
        gap='1rem'
      >
        <Text fontSize='0.8rem' fontWeight='400' color='#98A3AA'>
          <p>{productInfo?.serialNumber}</p>
        </Text>
        <Text fontSize='0.8rem' fontWeight='400' color='rgba(0,0,0,.58)'>
          <p>{productInfo?.description}</p>
        </Text>
        <Text
          fontSize='0.8rem'
          fontWeight='400'
          listStyle='disc'
          color='rgba(0,0,0,.58)'
        >
          {productInfo?.features?.map((feature: string) => (
            <li>{feature}</li>
          ))}
        </Text>
      </Wrapper>
    </Wrapper>
  );
};

export default InfoDrawer;
