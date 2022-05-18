import React, { useCallback, useEffect, useState } from 'react';
import { ReactComponent as ShoppingBag } from 'assets/icons/svg/shopping-bag.svg';
import { useGlobal } from 'context/global/GlobalContext';
import { useTranslation } from 'react-i18next';
import { theme } from 'styles/theme';
import {
  ProductDetailsType,
  ShoppingModuleType,
  VariantDetails,
} from '../../types/ProductDetailsType';
import '../../../node_modules/slick-carousel/slick/slick.css';
import '../../../node_modules/slick-carousel/slick/slick-theme.css';
import QuantityController from 'components/QuantityController';
import placeholder from 'assets/images/png/placeholder.png';
import ProgressiveImage from 'react-progressive-image';
import SuccessDrawer from 'components/SuccessDrawer';
import ModuleWrapper from 'components/ModuleWrapper';
import useElementSize from 'hooks/useElementSize';
import SelectInput from 'components/SelectInput';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Image from 'components/Image';
import Text from 'components/Text';
import hash from 'object-hash';

type ShopDrawerProps = {
  data: ShoppingModuleType;
  productDescription?: string;
  closePage(): void;
  minimizeBranding?: boolean;
  brand: ProductDetailsType['brand'];
};

const findAndReplaceQuantity = (
  checkoutUri: string,
  quantity: number
): string => {
  return checkoutUri.replace('quantity_placeholder', quantity.toString());
};

const ShopDrawer: React.FC<ShopDrawerProps> = ({
  data,
  closePage,
  productDescription,
  minimizeBranding,
  brand,
}) => {
  const {
    allOptions,
    variantDetails,
    defaultVariantDetails,
    isProductLevel,
    discountCode,
  } = data;

  const [successDrawer, setSuccessDrawer] = useState(false);
  // Selected option
  const [option, updateOption] = useState<{ [key: string]: string }>({});
  // Chosen option will be the one shown always. It may be product or variant
  const [chosenOption, setChosenOption] = useState<VariantDetails>(
    defaultVariantDetails
  );

  const [isValidCombo, setIsValidCombo] = useState<boolean | null>(true);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [expandDescription, toggleExpandDescription] = useState<boolean>(false);
  const [contentRef, { height }] = useElementSize();
  const { logEvent, brandTheme } = useGlobal();
  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.shopDrawer',
  });

  const getCostText = useCallback(() => {
    return `${(
      parseFloat(
        !data.isDiscountAvailable
          ? chosenOption.price
          : chosenOption.discountedPrice || ''
      ) * selectedQuantity
    ).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [chosenOption, selectedQuantity, data.isDiscountAvailable]);

  useEffect(() => {
    if (defaultVariantDetails.options) {
      const optionObj: any = {};
      Object.keys(defaultVariantDetails.options).forEach((key) => {
        optionObj[key] = defaultVariantDetails.options![key];
      });
      updateOption({ ...optionObj });
    }
    setChosenOption(defaultVariantDetails);
  }, [defaultVariantDetails]);

  useEffect(() => {
    const objHash = hash(option);
    const variant = variantDetails?.find((item) => item.objectHash === objHash);
    if (variant) {
      setIsValidCombo(true);
      setChosenOption(variant);
      // setSelectedQuantity(variant.inventoryQuantity > 0 ? 1 : 0);
      setSelectedQuantity(1);
    } else {
      if (isProductLevel) {
        setIsValidCombo(true);
      } else {
        setIsValidCombo(false);
      }
    }
  }, [option, variantDetails, isProductLevel]);

  const handleQuantity = useCallback((value: string) => {
    setSelectedQuantity(parseInt(value));
  }, []);

  const modifyUrlToIncludeQuantity = useCallback(
    (link: string, quantity: number) => {
      return findAndReplaceQuantity(link, quantity);
    },
    [discountCode]
  );

  const handleCheckout = useCallback(() => {
    const link = modifyUrlToIncludeQuantity(
      chosenOption.checkoutUri,
      selectedQuantity
    );
    logEvent({
      eventType: 'ENGAGEMENTS',
      event: 'SHOPPING_CHECK_OUT',
      data: {
        productId: chosenOption.id,
        quantity: selectedQuantity,
      },
    });
    setTimeout(() => {
      window.open(`https://${link}`, '_blank');
    });
  }, [chosenOption, modifyUrlToIncludeQuantity, selectedQuantity, logEvent]);

  const closeSuccess = useCallback(() => {
    setSuccessDrawer(false);
    closePage();
  }, [closePage]);

  useEffect(() => {
    if (successDrawer) {
      setTimeout(() => {
        setSelectedQuantity(1);
      }, 1000);
      setTimeout(() => {
        setSuccessDrawer(false);
      }, 3000);
    }
  }, [successDrawer]);

  return (
    <>
      <SuccessDrawer
        isOpen={successDrawer}
        title={''}
        description={''}
        close={closeSuccess}
      />
      <ModuleWrapper>
        <Wrapper
          width='100%'
          height='100%'
          direction='column'
          justifyContent='flex-start'
          alignItems='center'
          overflow='auto'
        >
          {data.isDiscountAvailable && (
            <Wrapper
              position='absolute'
              top='-1px'
              width='auto'
              height='auto'
              borderRadius='0 0 15px 15px'
              paddingTop='1rem'
              padding='0.4rem 1.5rem'
              background={brandTheme || theme.primary}
            >
              <Text fontSize='0.8rem' color='#FFFFFF'>
                <p>
                  {t('savingBanner.pre')} {data.discountPercentage!}
                  {t(
                    minimizeBranding
                      ? 'savingBanner.postWithoutBranding'
                      : 'savingBanner.postWithBranding'
                  )}
                </p>
              </Text>
            </Wrapper>
          )}
          <Wrapper
            width='100%'
            justifyContent='space-between'
            alignItems='center'
            minHeight='200px'
            gap='0.5rem'
            margin='3rem 0 0 0'
          >
            <ProgressiveImage
              src={chosenOption.image}
              placeholder={placeholder}
            >
              {(src: string, loading: boolean) => (
                <Image
                  rounded
                  src={src}
                  width='100%'
                  maxWidth='40%'
                  height='auto'
                  top={0}
                  left={0}
                  objectFit='contain'
                  transition='0.3s'
                  alt='product-image'
                  opacity={loading ? 0.5 : 1}
                />
              )}
            </ProgressiveImage>
            <Wrapper
              width='55%'
              height='100%'
              direction='column'
              justifyContent='center'
              padding='0rem 0.5rem'
              gap='1rem'
            >
              <Wrapper width='100%' direction='column' gap='0.1rem'>
                <Text
                  color='#98A3AA'
                  fontSize='0.75rem'
                  fontWeight='bold'
                  textDecoration='line-through'
                >
                  {chosenOption.name}
                </Text>
                <Wrapper
                  direction='row'
                  width='max-content'
                  alignItems='center'
                  gap='0.4rem'
                >
                  {isValidCombo && data.isDiscountAvailable && (
                    <>
                      <Text
                        color='#98A3AA'
                        fontSize='0.75rem'
                        fontWeight='500'
                        textDecoration='line-through'
                      >
                        <p>
                          {parseFloat(chosenOption.price).toLocaleString(
                            'en-US',
                            {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </p>
                      </Text>
                      <Text fontSize='0.9rem' fontWeight='600'>
                        <p>
                          {parseFloat(
                            chosenOption.discountedPrice!
                          ).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </Text>
                    </>
                  )}
                  {isValidCombo && !data.isDiscountAvailable && (
                    <Text fontSize='0.9rem' fontWeight='600'>
                      <p>
                        {parseFloat(chosenOption.price).toLocaleString(
                          'en-US',
                          {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>
                    </Text>
                  )}
                </Wrapper>
              </Wrapper>
              {isValidCombo && (
                <QuantityController
                  onChange={handleQuantity}
                  value={String(selectedQuantity)}
                  // limit={chosenOption.inventoryQuantity}
                />
              )}
            </Wrapper>
          </Wrapper>
          {productDescription && (
            <Wrapper
              width='100%'
              overflow='hidden'
              transition='0.3s'
              position='relative'
              padding='0 0 1rem 0'
              style={{ height: expandDescription ? height + 16 : '70px' }}
            >
              <Wrapper
                position='relative'
                direction='column'
                gap='0.5rem'
                overflow={expandDescription ? 'visible' : 'hidden'}
              >
                <Text
                  color='#414149'
                  fontSize='0.75rem'
                  ref={contentRef}
                  style={{ whiteSpace: 'pre-line', maxWidth: '100%' }}
                >
                  <p>{productDescription}</p>
                </Text>
                {height > 54 && (
                  <Text
                    fontSize='0.75rem'
                    color='#4B6EFA'
                    style={{
                      display: 'block',
                      textDecoration: 'underline',
                      background: '#FFFFFF',
                      boxShadow: '-10px 1px 8px 0px rgba(256,256,256,1)',
                      position: 'absolute',
                      cursor: 'pointer',
                      bottom: 0,
                      right: 0,
                    }}
                    onClick={() => toggleExpandDescription(!expandDescription)}
                  >
                    <p>
                      {expandDescription
                        ? t('productDetails.showLess')
                        : t('productDetails.showMore')}
                    </p>
                  </Text>
                )}
              </Wrapper>
            </Wrapper>
          )}
          <Wrapper width='100%' direction='column' transition='0.3s'>
            <Wrapper
              width='100%'
              direction='column'
              justifyContent='flex-start'
              alignItems='center'
              gap='1rem'
              margin='0 0 1rem 0'
            >
              {allOptions?.map((optionItem, index) => (
                <SelectInput
                  key={`${optionItem.name}-${index}`}
                  id={optionItem.name}
                  label={optionItem.name}
                  options={optionItem.values}
                  onChange={(value) =>
                    updateOption((prev) => ({
                      ...prev,
                      [optionItem.name]: String(value),
                    }))
                  }
                  selected={option[optionItem.name]}
                />
              ))}
            </Wrapper>
            <Wrapper
              width='100%'
              direction='column'
              justifyContent='flex-start'
              alignItems='center'
            >
              {isValidCombo ? (
                <Button
                  inlineIcon
                  variant='dark'
                  brandTheme={brandTheme}
                  onClick={handleCheckout}
                  disabled={!isValidCombo || selectedQuantity < 1}
                  alignItems='flex-end'
                >
                  <div
                    style={{
                      position: 'relative',
                      height: '24px',
                    }}
                  >
                    <ShoppingBag width={24} />
                    <label
                      style={{
                        display: 'flex',
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        width: '24px',
                        zIndex: 99,
                        left: '0',
                        top: '5px',
                        color:
                          !isValidCombo || selectedQuantity < 1
                            ? '#ccc'
                            : brandTheme,
                      }}
                    >
                      {selectedQuantity}
                    </label>
                  </div>
                  {t('checkoutButton.callToAction')}
                  {selectedQuantity > 0 && (
                    <>
                      {' '}
                      &#8226;{' '}
                      <label style={{ color: theme.button.secondary }}>
                        {getCostText()}
                      </label>
                    </>
                  )}
                </Button>
              ) : (
                <Text fontSize='1rem' fontWeight='600'>
                  <p>
                    {isValidCombo === null
                      ? t('checkoutHint.chooseOptions')
                      : isValidCombo === false
                      ? t('checkoutHint.comboUnavailable')
                      : ''}
                  </p>
                </Text>
              )}
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </ModuleWrapper>
    </>
  );
};

export default ShopDrawer;
