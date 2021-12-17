import BottomDrawer from "components/BottomDrawer";
import CustomDrawer from "components/CustomDrawer";
import IconButton from "components/IconButton";
import Image from "components/Image";
import LinkModule from "components/LinkModule";
import LoadingIndicator from "components/LoadingIndicator";
import PageHeader from "components/PageHeader";
import ReferralDrawer from "components/ReferralDrawer";
import ShopDrawer from "components/ShopDrawer";
import WarrantyDrawer from "components/WarrantyDrawer";
import Wrapper from "components/Wrapper";
import { PageStateType } from "context/global/GlobalContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useGlobal } from "../../context/global/GlobalContext";
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

type ButtonType = {
  title: string | undefined;
  onClick: () => void;
  isHighlight: boolean;
  locked: boolean;
  pageState: PageStateType;
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
      setPageTitle(details?.product.name);
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
              drawerData={
                details?.modules[currentPage]?.moduleInfo as CustomModuleType
              }
            />
          );
        case "WARRANTY_MODULE":
          return (
            <WarrantyDrawer
              closePage={closeDrawerPage}
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
              id: "1",
              name: "Diffuser",
              image:
                "https://cdn.shopify.com/s/files/1/0613/7377/6118/products/ProductImagesinviewer-2.png?v=1638260490",
              price: "100",
              inventoryQuantity: 8,
              checkoutUri:
                "https://outer-edge-1.myshopify.com.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=42180557832438",
              options: {
                Size: "Small",
                Color: "Red",
              },
              objectHash: "cde23cc8036213f98bc41320c1ee281f7cd71334",
            },
            isDiscountAvailable: true,
            discountPercentage: 20,
            isProductLevel: false,
            allOptions: [
              {
                name: "Size",
                values: ["Small"],
              },
              {
                name: "Color",
                values: ["Red", "Green", "Blue", "Black", "Grey"],
              },
            ],
            variantDetails: [
              {
                id: "gid://shopify/ProductVariant/42180557832438",
                name: "Small / Red",
                image:
                  "https://cdn.shopify.com/s/files/1/0613/7377/6118/products/ProductImagesinviewer-2.png?v=1638260490",
                price: "12.00",
                inventoryQuantity: 9,
                checkoutUri:
                  "https://outer-edge-1.myshopify.com.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=42180557832438",
                options: {
                  Size: "Small",
                  Color: "Red",
                },
                objectHash: "cde23cc8036213f98bc41320c1ee281f7cd71334",
              },
              {
                id: "gid://shopify/ProductVariant/42180557865206",
                name: "Small / Green",
                price: "12.00",
                image:
                  "https://cdn.shopify.com/s/files/1/0613/7377/6118/products/ProductImagesinviewer-2.png?v=1638260490",
                inventoryQuantity: 1,
                checkoutUri:
                  "https://outer-edge-1.myshopify.com.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=42180557865206%26items[][quantity]=1%26return_to=/checkout",
                options: {
                  Size: "Small",
                  Color: "Green",
                },
                objectHash: "b538cbcd3886ac0436774ce424ce3c400aff14c0",
              },
              {
                id: "gid://shopify/ProductVariant/42180557897974",
                name: "Small / Blue",
                price: "13.00",
                image:
                  "https://cdn.shopify.com/s/files/1/0613/7377/6118/products/ProductImagesinviewer-2.png?v=1638260490",
                inventoryQuantity: 1,
                checkoutUri:
                  "https://outer-edge-1.myshopify.com.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=42180557897974",
                options: {
                  Size: "Small",
                  Color: "Blue",
                },
                objectHash: "f60b77b44b5c81aa3ae328afd1a7bd3f73252b65",
              },
              {
                id: "gid://shopify/ProductVariant/42180557930742",
                name: "Small / Black",
                price: "14.00",
                image:
                  "https://cdn.shopify.com/s/files/1/0613/7377/6118/products/ProductImagesinviewer-2.png?v=1638260490",
                inventoryQuantity: 2,
                checkoutUri:
                  "https://outer-edge-1.myshopify.com.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=42180557930742",
                options: {
                  Size: "Small",
                  Color: "Black",
                },
                objectHash: "2b8cbc174c5bd85a69f1354ba534b444b354f92c",
              },
              // {
              //   id: 'gid://shopify/ProductVariant/42180557963510',
              //   name: 'Small / Grey',
              //   price: '12.00',
              //   image:
              //     'https://cdn.shopify.com/s/files/1/0613/7377/6118/products/ProductImagesinviewer-2.png?v=1638260490',
              //   inventoryQuantity: 3,
              //   checkoutUri:
              //     'https://outer-edge-1.myshopify.com.myshopify.com/cart/clear?return_to=/cart/add?items[][id]=42180557963510',
              //   options: {
              //     Size: 'Small',
              //     Color: 'Grey',
              //   },
              //   objectHash: '4964b788d306b85175e068de6e5124c54457b910',
              // },
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
          theme="dark"
          iconName="menu"
          onClick={handleOpenMenuClicked}
        />
      </Wrapper>
    ),
    [handleOpenMenuClicked]
  );

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
