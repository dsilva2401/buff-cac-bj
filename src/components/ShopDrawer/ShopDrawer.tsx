import React, { useCallback, useEffect, useState } from 'react';
import { ReactComponent as ShoppingBag } from 'assets/icons/svg/shopping-bag.svg';
import { ReactComponent as Close } from 'assets/icons/svg/close.svg';
import { useGlobal } from 'context/global/GlobalContext';
import { useTranslation } from 'react-i18next';
import { theme } from 'styles/theme';
import {
  ProductDetailsType,
  ShoppingModuleType,
  VariantDetails,
  AllOptionsType,
} from '../../types/ProductDetailsType';
import '../../../node_modules/slick-carousel/slick/slick.css';
import '../../../node_modules/slick-carousel/slick/slick-theme.css';
import QuantityController from 'components/QuantityController';
import placeholder from 'assets/images/png/placeholder.png';
import ProgressiveImage from 'react-progressive-image';
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
  productDescription,
  minimizeBranding,
}) => {
  const {
    allOptions,
    variantDetails,
    defaultVariantDetails,
    isProductLevel,
    discountCode,
  } = data;

  // Selected option
  const [option, updateOption] = useState<{ [key: string]: string }>({});
  // Chosen option will be the one shown always. It may be product or variant
  const [chosenOption, setChosenOption] = useState<VariantDetails>(
    defaultVariantDetails
  );

  const [isValidCombo, setIsValidCombo] = useState<boolean | null>(true);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [expandDescription, toggleExpandDescription] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState<any>([]);
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

  useEffect(() => {
    const filterItems = (
      allPropertiesList: (string | null)[],
      options: AllOptionsType[]
    ) => {
      let nonNullPropertyIndexes: any = [];
      for (let x = 0; x < allPropertiesList.length; x++)
        if (allPropertiesList[x] !== null) nonNullPropertyIndexes.push(x);
      if (nonNullPropertyIndexes.length === 0) return options;

      let filtered = JSON.parse(JSON.stringify(options));
      for (let x = 0; x < filtered.length; x++) filtered[x].values = [];

      let variantDetails: VariantDetails[] | undefined = data.variantDetails;
      for (let x = 0; x < nonNullPropertyIndexes.length; x++) {
        let newVariantDetails: VariantDetails[] = [];
        variantDetails?.forEach((variant: any) => {
          if (
            variant.options[options[nonNullPropertyIndexes[x]]?.name] ===
              allPropertiesList[nonNullPropertyIndexes[x]] &&
            variant.inventoryQuantity > 0
          )
            newVariantDetails.push(variant);
        });
        variantDetails = newVariantDetails;
      }

      if (variantDetails !== undefined) {
        for (let x = 0; x < variantDetails.length; x++)
          populateOptions(filtered, variantDetails[x]);
      }
      return filtered;
    };
    if (data && data !== undefined && allOptions) {
      const options = JSON.parse(JSON.stringify(allOptions));
      const choosenOptions: (string | null)[] = [null, null, null];
      for (let x = 0; x < options.length; x++) {
        if (options[x].name in option) {
          choosenOptions[x] = option[options[x].name].valueOf() || null;
        }
      }
      setFilteredOptions(filterItems(choosenOptions, allOptions));
    }
  }, [option]);

  const populateOptions = (filtered: any, variant: any) => {
    for (let x = 0; x < filtered.length; x++) {
      if (!filtered[x].values.includes(variant.options[filtered[x].name])) {
        filtered[x].values.push(variant.options[filtered[x].name]);
      }
    }
  };

  const handleQuantity = useCallback((value: string) => {
    setSelectedQuantity(parseInt(value));
  }, []);

  const modifyUrlToIncludeQuantity = useCallback(
    (link: string, quantity: number) => {
      return findAndReplaceQuantity(link, quantity);
    },
    [discountCode, data.isDiscountAvailable]
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

  return (
    <ModuleWrapper>
      <Wrapper
        width='100%'
        height='100%'
        direction='column'
        justifyContent='flex-start'
        padding='0 0 1rem 0'
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
            padding='1rem 1.5rem 0.4rem 1.5rem'
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
          margin='3rem 0 0 0'
        >
          <ProgressiveImage src={chosenOption.image} placeholder={placeholder}>
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
            padding='0 0.5rem'
          >
            <Wrapper width='100%' direction='column' margin='0 0 1rem 0'>
              <Text
                color='#98A3AA'
                fontSize='0.75rem'
                fontWeight='bold'
                margin='0 0 0.1rem 0'
                textDecoration='line-through'
              >
                {chosenOption.name}
              </Text>
              <Wrapper direction='row' width='max-content' alignItems='center'>
                {data.isDiscountAvailable && (
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
                    <Text
                      fontSize='0.9rem'
                      fontWeight='600'
                      padding='0 0 0 0.4rem'
                    >
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
                {!data.isDiscountAvailable && (
                  <Text fontSize='0.9rem' fontWeight='600'>
                    <p>
                      {parseFloat(chosenOption.price).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </Text>
                )}
              </Wrapper>
            </Wrapper>
            <QuantityController
              onChange={handleQuantity}
              value={String(selectedQuantity)}
              // limit={chosenOption.inventoryQuantity}
            />
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
                  color={brandTheme || theme.primary}
                  style={{
                    display: 'block',
                    background: '#FFFFFF',
                    textDecoration: 'underline',
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
          {allOptions && filteredOptions && (
            <Wrapper
              width='100%'
              direction='column'
              justifyContent='flex-start'
              alignItems='center'
              margin='0 0 1rem 0'
            >
              {allOptions.map((optionItem: any, index: any) => {
                return (
                  <Wrapper position='relative' width='100%'>
                    {option[optionItem.name] && (
                      <Wrapper
                        height='38px'
                        width='38px'
                        padding='13px'
                        alignItems='center'
                        justifyContent='center'
                        position='absolute'
                        top='23px'
                        right='17px'
                        background='#FFFFFF'
                        zIndex={10}
                        onClick={() =>
                          updateOption((prev) => ({
                            ...prev,
                            [optionItem.name]: '',
                          }))
                        }
                      >
                        <Close />
                      </Wrapper>
                    )}
                    <SelectInput
                      key={`${optionItem.name}-${index}`}
                      id={optionItem.name}
                      label={optionItem.name}
                      selected={option[optionItem.name] || ''}
                      options={
                        filteredOptions[index]?.values &&
                        filteredOptions[index]?.values?.length > 0
                          ? filteredOptions[index]?.values
                          : optionItem.values
                      }
                      onChange={(value) =>
                        updateOption((prev) => ({
                          ...prev,
                          [optionItem.name]: String(value),
                        }))
                      }
                    />
                  </Wrapper>
                );
              })}
            </Wrapper>
          )}
          <Wrapper
            width='100%'
            direction='column'
            justifyContent='flex-start'
            alignItems='center'
          >
            <Button
              inlineIcon
              variant='dark'
              brandTheme={brandTheme}
              onClick={handleCheckout}
              disabled={!isValidCombo || selectedQuantity < 1}
              alignItems='flex-end'
              style={{ fontSize: '1rem' }}
            >
              <div
                style={{
                  position: 'relative',
                  height: '24px',
                }}
              >
                <ShoppingBag width={24} />
                {!Number.isNaN(selectedQuantity) && (
                  <label
                    style={{
                      display: 'flex',
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      width: '24px',
                      zIndex: 99,
                      left: '0',
                      top: '5px',
                      fontSize: '0.7rem',
                      color:
                        !isValidCombo || selectedQuantity < 1
                          ? '#ccc'
                          : brandTheme,
                    }}
                  >
                    {selectedQuantity}
                  </label>
                )}
              </div>
              {t('checkoutButton.callToAction')}
              {selectedQuantity > 0 && (
                <>
                  {' '}
                  &#8226;{' '}
                  <label
                    style={{
                      color: theme.button.secondary,
                      fontSize: '1rem',
                    }}
                  >
                    {getCostText()}
                  </label>
                </>
              )}
            </Button>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </ModuleWrapper>
  );
};

export default ShopDrawer;
