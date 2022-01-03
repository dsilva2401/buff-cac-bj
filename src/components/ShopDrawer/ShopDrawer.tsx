import React, { useCallback, useEffect, useState } from "react";
import {
  ShoppingModuleType,
  VariantDetails,
} from '../../types/ProductDetailsType';
import "../../../node_modules/slick-carousel/slick/slick-theme.css";
import "../../../node_modules/slick-carousel/slick/slick.css";
import { useTranslation } from "react-i18next";
import { theme } from "styles/theme";
import hash from "object-hash";
import Wrapper from "components/Wrapper";
import SelectInput from "components/SelectInput";
import SuccessDrawer from "components/SuccessDrawer";
import QuantityController from "components/QuantityController";
import logEvent from "utils/eventLogger";
import Button from "components/Button";
import Image from "components/Image";
import Text from "components/Text";

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
      eventType: "EVENT_MODULE",
      event: "SHOPPING_CHECK_OUT",
      data: {
        details: {
          productId: chosenOption.id,
          quantity: selectedQuantity,
        },
      },
    });
    window.open(`http://${link}`, '_blank');
  }, [chosenOption, modifyUrlToIncludeQuantity, selectedQuantity]);

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
            : "Buy with Brij",
          width: "auto",
          height: "auto",
          padding: "0.4rem 1.5rem",
          position: "absolute",
          color: "#fff",
          top: "-1px",
          background: theme.primary,
          fontSize: "0.8rem",
          borderRadius: "0 0 15px 15px",
        }}
      >
        <Wrapper
          width='100%'
          justifyContent='space-between'
          alignItems='center'
          gap='0.5rem'
          margin='4rem 0 0 0'
        >
          <Wrapper width='45%' responsiveImg>
            <Image src={chosenOption.image} alt='' rounded width='100%' />
          </Wrapper>
          <Wrapper width="50%" height="100%" direction="column" justifyContent="center" gap="1rem" padding="0rem 0.5rem">
            <Wrapper width="100%" direction="column" gap="0.1rem">
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
                        {parseInt(chosenOption.discountedPrice!).toLocaleString(
                          'en-US',
                          {
                            style: 'currency',
                            currency: 'USD',
                            maximumSignificantDigits: 3,
                          }
                        )}
                      </p>
                    </Text>
                    <Text fontSize='0.9rem' fontWeight='600'>
                      <p>
                        {parseInt(chosenOption.price).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumSignificantDigits: 3,
                        })}
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
          width="100%"
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          gap="0.5rem"
          margin="1rem 0"
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
          margin='1.5rem 0 0'
        >
          {isValidCombo ? (
            <Button
              variant="dark"
              onClick={handleCheckout}
              disabled={!isValidCombo}
            >
              {t('checkoutButton.purchaseNow')}
            </Button>
          ) : (
            <Text fontSize="1rem" fontWeight="600">
              <p>
                {isValidCombo === null
                  ? t("checkoutHint.chooseOptions")
                  : isValidCombo === false
                    ? t("checkoutHint.comboUnavailable")
                    : ""}
              </p>
            </Text>
          )}
        </Wrapper>
      </Wrapper>
    </>
  );
};

export default ShopDrawer;
