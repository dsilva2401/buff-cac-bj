import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ButtonType } from "components/BottomDrawer/BottomDrawer";
import { useGlobal } from "../../context/global/GlobalContext";
import { Redirect } from "react-router-dom";
import { useParams } from "react-router";
import Image from "components/Image";
import IconButton from "components/IconButton";
import CustomDrawer from "components/CustomDrawer";
import BottomDrawer from "components/BottomDrawer";
import LoadingIndicator from "components/LoadingIndicator";
import ReferralDrawer from "components/ReferralDrawer";
import WarrantyDrawer from "components/WarrantyDrawer";
import LinkModule from "components/LinkModule";
import PageHeader from "components/PageHeader";
import ShopDrawer from "components/ShopDrawer";
import Wrapper from "components/Wrapper";
import {
  CustomModuleType,
  LinkModuleType,
  ReferralModuleType,
  ShoppingModuleType,
  WarrantyModuleType,
} from "../../types/ProductDetailsType";

type UrlParam = {
  id: string;
};

const ProductDetails: React.FC = () => {
  const [isDrawerPageOpen, setIsDrawerPageOpen] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string | undefined>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const {
    productDetails: details,
    loading,
    error,
    pageState,
    setSignInRedirect,
    setIsMenuOpen,
    setSlug,
  } = useGlobal();

  const { id } = useParams<UrlParam>();

  useEffect(() => {
    if (id) {
      setSlug(id);
    }
  }, [id, setSlug]);

  useEffect(() => {
    if (!!details && !isDrawerPageOpen) {
      setPageTitle(details?.product?.name);
    }
  }, [isDrawerPageOpen, details, currentPage, pageState]);

  const closeDrawerPage = useCallback(() => {
    setCurrentPage(0);
    setIsDrawerPageOpen(false);
  }, []);

  const changeDrawerPage = useCallback(
    (index, moduleType) => {
      setCurrentPage(index);
      setIsDrawerPageOpen(moduleType !== "LINK_MODULE");
      if (moduleType !== "LINK_MODULE")
        setPageTitle(details?.modules[index].title);
    },
    [details]
  );

  let buttonsArray = useMemo(() => {
    let buttons: ButtonType[] = [];
    if (details) {
      for (let x = 0; x < details?.modules?.length; x++) {
        if (details?.modules[x]?.locked) {
          setSignInRedirect(`/product/${id}`);
        }
        let title: string;
        switch (details.modules[x].type) {
          case "WARRANTY_MODULE":
            const moduleInfo = details.modules[x]
              .moduleInfo as WarrantyModuleType;
            title = moduleInfo?.activated
              ? "View Warranty"
              : "Activate Warranty";
            break;
          default:
            title = details.modules[x].title;
            break;
        }
        let buttonObject: ButtonType = {
          title,
          onClick: () => changeDrawerPage(x, details.modules[currentPage].type),
          isHighlight: x === 0,
          locked: details?.modules[x].locked,
          pageState: details?.modules[x].locked
            ? {
              currentPage: x,
              isDrawerOpen: true,
              pageTitle: details?.modules[x].title,
            }
            : null,
        };
        buttons.push(buttonObject);
      }
    }
    return buttons;
  }, [changeDrawerPage, id, details, currentPage, setSignInRedirect]);

  const renderDrawerPage = useCallback(() => {
    if (details) {
      let moduleType: string | undefined = details?.modules[currentPage]?.type;
      switch (moduleType) {
        case "CUSTOM_MODULE":
          return (
            <CustomDrawer
              drawerTitle={details?.modules[currentPage]?.title}
              drawerData={
                details?.modules[currentPage]?.moduleInfo as CustomModuleType
              }
            />
          );
        case "WARRANTY_MODULE":
          return (
            <WarrantyDrawer
              closePage={closeDrawerPage}
              drawerTitle={details?.modules[currentPage]?.title}
              warrantyData={
                details?.modules[currentPage]?.moduleInfo as WarrantyModuleType
              }
              warrantyId={details?.modules[currentPage]?.id}
            />
          );
        case "LINK_MODULE":
          return (
            <LinkModule
              closePage={closeDrawerPage}
              moduleData={
                details?.modules[currentPage]?.moduleInfo as LinkModuleType
              }
            />
          );
        case "REFERRAL_MODULE":
          return (
            <ReferralDrawer
              drawerTitle={details?.modules[currentPage]?.title}
              referralData={
                details?.modules[currentPage]?.moduleInfo as ReferralModuleType
              }
            />
          );
        case "SHOPPING_MODULE":
          // const data = details?.modules[currentPage]
          //   ?.moduleInfo as ShoppingModuleType;
          const data: ShoppingModuleType = {
            defaultVariantDetails: {
              id: "gid://shopify/ProductVariant/42180557865206",
              name: "Ranger Parka",
              image:
                "https://cdn.shopify.com/s/files/1/0613/7377/6118/products/m-blaw21wct05a-billion-original-imag75tsgp44hbqy.jpg?v=1639769586",
              price: "12.00",
              discountedPrice: "9.60",
              inventoryQuantity: 1,
              checkoutUri:
                "https://outer-edge-1.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=gid://shopify/ProductVariant/42180557865206",
              options: { Size: "Small", Color: "Green" },
              objectHash: "b538cbcd3886ac0436774ce424ce3c400aff14c0",
            },
            isDiscountAvailable: true,
            discountPercentage: 20,
            discountCode: "TEST20",
            isProductLevel: false,
            allOptions: [
              { name: "Size", values: ["Small", "Large"] },
              { name: "Color", values: ["Green", "Blue", "Brown"] },
            ],
            variantDetails: [
              {
                id: "gid://shopify/ProductVariant/42180557865206",
                name: "Ranger Parka",
                image:
                  "https://cdn.shopify.com/s/files/1/0613/7377/6118/products/m-blaw21wct05a-billion-original-imag75tsgp44hbqy.jpg?v=1639769586",
                price: "12.00",
                discountedPrice: "9.60",
                inventoryQuantity: 1,
                checkoutUri:
                  "https://outer-edge-1.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=42180557865206",
                options: { Size: "Small", Color: "Green" },
                objectHash: "b538cbcd3886ac0436774ce424ce3c400aff14c0",
              },
              {
                id: "gid://shopify/ProductVariant/42180557897974",
                name: "Ranger Parka",
                image:
                  "https://cdn.shopify.com/s/files/1/0613/7377/6118/products/m-blaw21wct05b-billion-original-imag75v7kugpxufh.jpg?v=1639769587",
                price: "13.00",
                discountedPrice: "10.40",
                inventoryQuantity: 3,
                checkoutUri:
                  "https://outer-edge-1.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=42180557897974",
                options: { Size: "Small", Color: "Blue" },
                objectHash: "f60b77b44b5c81aa3ae328afd1a7bd3f73252b65",
              },
              {
                id: "gid://shopify/ProductVariant/42180557963510",
                name: "Ranger Parka",
                image:
                  "https://cdn.shopify.com/s/files/1/0613/7377/6118/products/m-blaw21wct05c-billion-original-imag75v7ncyctudk.jpg?v=1639769587",
                price: "15.00",
                discountedPrice: "12.00",
                inventoryQuantity: 5,
                checkoutUri:
                  "https://outer-edge-1.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=42180557963510",
                options: { Size: "Small", Color: "Brown" },
                objectHash: "3f6cbc73f505f205b7613edf2d2f79d14230b105",
              },
              {
                id: "gid://shopify/ProductVariant/42272991936758",
                name: "Ranger Parka",
                image:
                  "https://cdn.shopify.com/s/files/1/0613/7377/6118/products/m-blaw21wct05a-billion-original-imag75tsgp44hbqy.jpg?v=1639769586",
                price: "15.00",
                discountedPrice: "12.00",
                inventoryQuantity: 2,
                checkoutUri:
                  "https://outer-edge-1.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=42272991936758",
                options: { Size: "Large", Color: "Green" },
                objectHash: "ef39ce00effedaa4968952a3da6bfadfe20de9e4",
              },
              {
                id: "gid://shopify/ProductVariant/42272991969526",
                name: "Ranger Parka",
                image:
                  "https://cdn.shopify.com/s/files/1/0613/7377/6118/products/m-blaw21wct05a-billion-original-imag75tsgp44hbqy.jpg?v=1639769586",
                price: "12.00",
                discountedPrice: "9.60",
                inventoryQuantity: 0,
                checkoutUri:
                  "https://outer-edge-1.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=42272991969526",
                options: { Size: "Large", Color: "Blue" },
                objectHash: "2fd69e26efab6537e7b1a6337efe8a9cf7e21388",
              },
              {
                id: "gid://shopify/ProductVariant/42272992002294",
                name: "Ranger Parka",
                image:
                  "https://cdn.shopify.com/s/files/1/0613/7377/6118/products/m-blaw21wct05a-billion-original-imag75tsgp44hbqy.jpg?v=1639769586",
                price: "12.00",
                discountedPrice: "9.60",
                inventoryQuantity: 0,
                checkoutUri:
                  "https://outer-edge-1.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=42272992002294",
                options: { Size: "Large", Color: "Brown" },
                objectHash: "1a0144925e4fb7a7c061ef2ce65a51ed6beeca2c",
              },
            ],
          };
          return <ShopDrawer data={data} closePage={closeDrawerPage} />;
        default:
          return null;
      }
    }
  }, [currentPage, closeDrawerPage, details]);

  const logo = useCallback(
    (image: string) => <Image src={image} alt="brand-logo" maxWidth="110px" />,
    []
  );

  const handleOpenMenuClicked = useCallback(
    () => setIsMenuOpen(true),
    [setIsMenuOpen]
  );

  const menuButton = useMemo(
    () => (
      <Wrapper width="100%" justifyContent="flex-end">
        <IconButton
          variant="dark"
          iconName="menu"
          onClick={handleOpenMenuClicked}
        />
      </Wrapper>
    ),
    [handleOpenMenuClicked]
  );

  if (error) return <Redirect to="/404" />;

  return (
    <>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <Wrapper
            width="100%"
            height="100%"
            direction="column"
            justifyContent="space-between"
            overflow="auto"
          >
            <PageHeader
              logo={logo(details?.brand?.image ?? "")}
              actionButton={menuButton}
              border={false}
            />
            <Wrapper
              width="100%"
              height="100%"
              justifyContent="center"
              alignItems="flex-start"
              padding="2rem 1rem"
              responsiveImg
            >
              <Image src={details?.product?.image} alt="product" />
            </Wrapper>
          </Wrapper>
          <BottomDrawer
            title={pageTitle}
            buttons={buttonsArray}
            socials={details?.brand?.social}
            isChildOpen={isDrawerPageOpen}
            closeChild={closeDrawerPage}
          >
            {renderDrawerPage()}
          </BottomDrawer>
        </>
      )}
    </>
  );
};

export default ProductDetails;
