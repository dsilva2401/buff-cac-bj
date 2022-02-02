import placeholder from 'assets/images/png/placeholder.png';
import Button from 'components/Button';
import Image from 'components/Image';
import QuantityController from 'components/QuantityController';
import SelectInput from 'components/SelectInput';
import SuccessDrawer from 'components/SuccessDrawer';
import Text from 'components/Text';
import Wrapper from 'components/Wrapper';
import { useGlobal } from 'context/global/GlobalContext';
import useLogEvent from 'hooks/useLogEvent';
import hash from 'object-hash';
import React, { useCallback, useEffect, useState } from 'react';
import { Animated } from 'react-animated-css';
import { useTranslation } from 'react-i18next';
import ProgressiveImage from 'react-progressive-image';
import { theme } from 'styles/theme';
import '../../../node_modules/slick-carousel/slick/slick-theme.css';
import '../../../node_modules/slick-carousel/slick/slick.css';
import {
  ShoppingModuleType,
  VariantDetails,
} from '../../types/ProductDetailsType';

type ShopDrawerProps = {
  data: ShoppingModuleType;
  closePage(): void;
};

const ShopDrawer: React.FC<ShopDrawerProps> = ({ data, closePage }) => {
  const [successDrawer, setSuccessDrawer] = useState(false);
  const {
    allOptions,
    variantDetails,
    defaultVariantDetails,
    isProductLevel,
    discountCode,
  } = data;

  const { retractDrawer } = useGlobal();

  const logEvent = useLogEvent();

  // Selected option
  const [option, updateOption] = useState<{ [key: string]: string }>({});

  // Chosen option will be the one shown always. It may be product or variant
  const [chosenOption, setChosenOption] = useState<VariantDetails>(
    defaultVariantDetails
  );

  const [isValidCombo, setIsValidCombo] = useState<boolean | null>(true);

  const [selectedQuantity, setSelectedQuantity] = useState(1);

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
      setSelectedQuantity(1);
    } else {
      if (isProductLevel) {
        setIsValidCombo(true);
      } else {
        setIsValidCombo(false);
      }
    }
  }, [option, variantDetails, isProductLevel]);

  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.shopDrawer',
  });

  const handleQuantity = useCallback((value: string) => {
    setSelectedQuantity(parseInt(value));
  }, []);

  const modifyUrlToIncludeQuantity = useCallback(
    (link: string, quantity: number) => {
      if (discountCode) {
        return link.concat(
          `%26items[][quantity]=${quantity}%26return_to=/checkout?discount=${discountCode}`
        );
      } else {
        return link.concat(
          `%26items[][quantity]=${quantity}%26return_to=/checkout`
        );
      }
    },
    [discountCode]
  );

  const handleCheckout = useCallback(() => {
    const link = modifyUrlToIncludeQuantity(
      chosenOption.checkoutUri,
      selectedQuantity
    );
    logEvent({
      type: 'EVENT_MODULE',
      name: 'SHOPPING_CHECK_OUT',
      data: {
        details: {
          productId: chosenOption.id,
          quantity: selectedQuantity,
        },
      },
    });
    setTimeout(() => {
      window.open(`http://${link}`, '_blank');
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
      <Animated
        animationIn='slideInRight'
        animationOut='slideOutLeft'
        animationInDuration={300}
        animationOutDuration={300}
        animationInDelay={retractDrawer ? 200 : 0}
        isVisible={true}
        style={{ width: '100%' }}
      >
        <Wrapper
          width='100%'
          height='100%'
          direction='column'
          justifyContent='flex-start'
          alignItems='center'
          overflow='auto'
          before={{
            content: data.isDiscountAvailable
              ? `You are saving ${data.discountPercentage!}% with Brij`
              : '',
            width: 'auto',
            height: 'auto',
            padding: '0.4rem 1.5rem',
            position: 'absolute',
            color: '#fff',
            top: '-1px',
            background: theme.primary,
            fontSize: '0.8rem',
            borderRadius: '0 0 15px 15px',
          }}
        >
          <Wrapper
            width='100%'
            justifyContent='space-between'
            alignItems='center'
            margin='3rem 0 0 0'
            gap='0.5rem'
          >
            <Wrapper
              width='40%'
              height='200px'
              responsiveImg
              borderRadius='0.75rem'
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
                    height='100%'
                    top={0}
                    left={0}
                    objectFit='contain'
                    transition='0.3s'
                    alt='product-image'
                    opacity={loading ? 0.5 : 1}
                  />
                )}
              </ProgressiveImage>
            </Wrapper>
            <Wrapper
              width='55%'
              height='100%'
              direction='column'
              justifyContent='center'
              gap='1rem'
              padding='0rem 0.5rem'
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
                          {parseInt(
                            chosenOption.discountedPrice!
                          ).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumSignificantDigits: 3,
                          })}
                        </p>
                      </Text>
                      <Text fontSize='0.9rem' fontWeight='600'>
                        <p>
                          {parseInt(chosenOption.price).toLocaleString(
                            'en-US',
                            {
                              style: 'currency',
                              currency: 'USD',
                              maximumSignificantDigits: 3,
                            }
                          )}
                        </p>
                      </Text>
                    </>
                  )}
                  {isValidCombo && !data.isDiscountAvailable && (
                    <Text fontSize='0.9rem' fontWeight='600'>
                      <p>
                        {parseInt(chosenOption.price).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumSignificantDigits: 3,
                        })}
                      </p>
                    </Text>
                  )}
                </Wrapper>
              </Wrapper>
              {isValidCombo ? (
                <Wrapper>
                  <QuantityController
                    value={String(selectedQuantity)}
                    onChange={handleQuantity}
                    limit={chosenOption.inventoryQuantity}
                  />
                </Wrapper>
              ) : null}
            </Wrapper>
          </Wrapper>

          <Wrapper
            width='100%'
            direction='column'
            justifyContent='flex-start'
            alignItems='center'
            gap='0.5rem'
            margin='1rem 0'
          >
            {allOptions?.map((optionItem) => (
              <SelectInput
                key={optionItem.name}
                id={optionItem.name}
                label={optionItem.name}
                options={optionItem.values}
                isSuccess={successDrawer}
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
                variant='dark'
                onClick={handleCheckout}
                disabled={!isValidCombo}
              >
                {t('checkoutButton.purchaseNow')}
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
      </Animated>
    </>
  );
};

export default ShopDrawer;
