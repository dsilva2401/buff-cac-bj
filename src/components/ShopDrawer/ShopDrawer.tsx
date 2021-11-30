import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import hash from "object-hash";
import QuantityController from "components/QuantityController";
import SuccessDrawer from "components/SuccessDrawer";
import SelectInput from "components/SelectInput";
import Wrapper from "components/Wrapper";
import Button from "components/Button";
import Image from "components/Image";
import Text from "components/Text";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";
import "../../../node_modules/slick-carousel/slick/slick.css";

type ShopDrawerProps = {
  data: any;
  product: any;
  closePage(): void;
};

const ShopDrawer: React.FC<ShopDrawerProps> = ({
  data,
  product,
  closePage,
}) => {
  const [successDrawer, setSuccessDrawer] = useState(false);
  const { shoppingVariantDetails, meta } = data;
  const { allOptions, validVariantOptions, productImage } =
    shoppingVariantDetails;
  const discount: number = shoppingVariantDetails.discount || 0;
  const validOptionsHash = useRef<{ [key: string]: boolean | undefined }>();
  const [option, updateOption] = useState<{ [key: string]: string }>({});
  const [isValidCombo, setIsValidCombo] = useState<boolean | null>(null);
  const [checkoutUri, setCheckoutUri] = useState("invalid");
  const [isAvailable, setIsAvailable] = useState(false);
  const [image, setImage] = useState(productImage);
  const [price, setPrice] = useState<number | undefined>(0);
  const [quantity, setQuantity] = useState("1");
  const [inventory, setInventory] = useState<number | undefined>(0);

  useEffect(() => {
    const obj: { [key: string]: boolean | undefined } = {};
    validVariantOptions.map((item: any) => (obj[item.objectHash] = true));
    validOptionsHash.current = obj;
  }, [validVariantOptions]);

  useEffect(() => {
    if (Object.keys(option).length === allOptions.length) {
      const objHash = hash(option);
      const isValid = validOptionsHash.current?.[objHash] ?? false;
      setIsValidCombo(isValid);
      if (isValid) {
        const obj = validVariantOptions.find(
          (item: any) => item.objectHash === objHash
        );
        if (obj?.checkoutUri) setCheckoutUri(obj.checkoutUri);
        if (obj?.price) setPrice(obj.price);
        setIsAvailable(!!obj?.inventoryQuantity);
        setInventory(obj?.inventoryQuantity);
        if (obj?.image) {
          setImage(obj.image);
        } else {
          setPrice(0);
          setIsAvailable(false);
          setCheckoutUri("invalid");
        }
      }
    }
  }, [option, validVariantOptions, allOptions]);

  const { t } = useTranslation("translation", {
    keyPrefix: "drawers.shopDrawer",
  });

  const handleQuantity = (value: string) => {
    setQuantity(value);
  };

  const handleCheckout = (link: string) => {
    window.open(link);
  };

  const closeSuccess = () => {
    setSuccessDrawer(false);
    closePage();
  };

  useEffect(() => {
    if (successDrawer) {
      setTimeout(() => {
        setQuantity("1");
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
        title={t("successDrawer.title")}
        description={t("successDrawer.description")}
        close={closeSuccess}
      />
      <Wrapper
        width="100%"
        height="100%"
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        overflow="auto"
        before={{
          content: `${t("savingBanner.pre")} ${
            shoppingVariantDetails.discount
          }${t("savingBanner.post")}`,
          width: "auto",
          height: "auto",
          padding: "0.4rem 1.5rem",
          position: "absolute",
          color: "#fff",
          top: "-1px",
          background: "#1B1B1B",
          fontSize: "0.8rem",
          borderRadius: "0 0 15px 15px",
        }}
      >
        <Wrapper
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          gap="0.5rem"
        >
          <Wrapper width="45%" responsiveImg>
            <Image src={image} alt="" rounded width="100%" />
          </Wrapper>
          <Wrapper width="50%" height="100%" direction="column" gap="1rem">
            {data && (
              <Wrapper width="100%" direction="column" gap="0.1rem">
                <Text fontSize="1rem" fontWeight="600">
                  <p>{product.name}</p>
                </Text>

                {discount > 0 && parseInt(quantity) > 0 ? (
                  <Wrapper
                    direction="row"
                    width="max-content"
                    alignItems="center"
                    gap="0.4rem"
                  >
                    <Text
                      color="#98A3AA"
                      fontSize="0.75rem"
                      fontWeight="500"
                      textDecoration="line-through"
                    >
                      <p>
                        {isValidCombo
                          ? `${(price! * Number(quantity)).toLocaleString(
                              "en-US",
                              {
                                style: "currency",
                                currency: "USD",
                                maximumSignificantDigits: 3,
                              }
                            )}`
                          : null}
                      </p>
                    </Text>
                    <Text fontSize="0.9rem" fontWeight="600">
                      <p>
                        {isValidCombo
                          ? `${(
                              (price! - price! * (discount / 100)) *
                              Number(quantity)
                            ).toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumSignificantDigits: 3,
                            })}`
                          : null}
                      </p>
                    </Text>
                  </Wrapper>
                ) : (
                  <Text fontSize="0.9rem" fontWeight="600">
                    <p>
                      {isValidCombo
                        ? `${(price! * Number(quantity)).toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "USD",
                              maximumSignificantDigits: 3,
                            }
                          )}`
                        : null}
                    </p>
                  </Text>
                )}
              </Wrapper>
            )}
            {isValidCombo ? (
              <Wrapper>
                <QuantityController
                  value={quantity}
                  onChange={handleQuantity}
                  limit={inventory}
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
        >
          {allOptions.map((optionItem: any) => (
            <SelectInput
              key={optionItem.name}
              id={optionItem.name}
              label={`Select ${optionItem.name}...`}
              options={optionItem.values}
              isSuccess={successDrawer}
              onChange={(value) =>
                updateOption({ ...option, [optionItem.name]: value })
              }
            />
          ))}
        </Wrapper>

        <Wrapper
          width="100%"
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          margin="1.5rem 0 0"
        >
          {isValidCombo ? (
            <Button
              theme="dark"
              onClick={() => handleCheckout(checkoutUri)}
              disabled={
                !isValidCombo || !isAvailable || parseInt(quantity) <= 0
              }
            >
              {!isAvailable
                ? t("checkoutButton.unavailable")
                : t("checkoutButton.purchaseNow")}
            </Button>
          ) : (
            <Text fontSize="1rem" fontWeight="600">
              <p>
                {" "}
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
