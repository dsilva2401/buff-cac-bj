import React, {
  useCallback,
  // useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
// import { DataContext } from "../../context/data/DataContext";
import { useGlobal } from "../../context/global/GlobalContext";
import RegistrationDrawer from "components/RegistrationDrawer";
import LoadingIndicator from "components/LoadingIndicator";
import WarrantyDrawer from "components/WarrantyDrawer";
import CustomDrawer from "components/CustomDrawer";
import BottomDrawer from "components/BottomDrawer";
import ShopDrawer from "components/ShopDrawer";
import IconButton from "components/IconButton";
import InfoDrawer from "components/InfoDrawer";
import PageHeader from "components/PageHeader";
import SmsDrawer from "components/SmsDrawer";
import Wrapper from "components/Wrapper";
import Image from "components/Image";

import { products } from "../../mocks/products";
import { ProductDetailsType } from "types/ProductDetailsType";

type UrlParam = {
  id: string;
};

enum DrawerPages {
  registration,
  warranty,
  custom,
  shop,
  info,
  sms,
}

const ProductDetails: React.FC = () => {
  const [details, setDetails] = useState<ProductDetailsType | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  const { t } = useTranslation("translation", { keyPrefix: "productDetails" });
  const { id } = useParams<UrlParam>();
  // const {
  //   productDetailsError: error,
  //   productDetailsLoading: loading,
  //   productDetails: details,
  //   getProductDetails,
  // } = useContext(DataContext);

  useEffect(() => {
    if(id) {
      let product = null
      product = products.find(product => product.tag.slug === id)
      product ? setDetails(product) : setError(true)
    }
    setLoading(false)
  }, [id])

  const { setIsMenuOpen } = useGlobal();

  const [isDrawerPageOpen, setIsDrawerPageOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<DrawerPages>(0);
  const [pageTitle, setPageTitle] = useState("");

  // useEffect(() => {
  //   if (id) {
  //     getProductDetails(id);
  //   }
  // }, [id, getProductDetails]);

  useEffect(() => {
    if (!!details && !isDrawerPageOpen) {
      setPageTitle(details.product.name);
    }
  }, [isDrawerPageOpen, details]);

  const closeDrawerPage = useCallback(() => {
    setIsDrawerPageOpen(false);
  }, []);

  const changeDrawerPage = useCallback(
    (
      page: "warranty" | "shop" | "info" | "sms" | "registration" | "custom"
    ) => {
      setIsDrawerPageOpen(true);
      setPageTitle(
        page !== "shop"
          ? details?.modules[page]?.title || t(`modules.${page}.title`)
          : ""
      );
      setCurrentPage(DrawerPages[page]);
    },
    [details, t]
  );

  const renderDrawerPage = useCallback(() => {
    switch (currentPage) {
      case DrawerPages.registration:
        return (
          <RegistrationDrawer
            isAuthenticated={false} //useUser to fetch user's authentication status
            registrationData={details?.modules.registration}
            closePage={closeDrawerPage}
          />
        );
      case DrawerPages.warranty:
        return (
          <WarrantyDrawer
            isRegistered={details?.modules.warranty?.activated}
            warrantyActivated={details?.modules.warranty?.activated}
            closePage={closeDrawerPage}
            warrantyData={details?.modules.warranty}
          />
        );
      case DrawerPages.shop:
        return (
          <ShopDrawer
            product={details?.product}
            data={details?.modules.shop}
            closePage={closeDrawerPage}
          />
        );
      case DrawerPages.info:
        return (
          <InfoDrawer
            productInfo={details?.modules.info}
            product={details?.product}
            closePage={closeDrawerPage}
          />
        );
      case DrawerPages.sms:
        return <SmsDrawer smsModuleData={details?.modules.sms} />;
      case DrawerPages.custom:
        return <CustomDrawer drawerData={details?.modules.custom} />;
      // complete missing modules
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

  const buttonsArray = useMemo(
    () => [
      {
        title: details?.modules.registration?.title || "Product Regsitration",
        onClick: () => changeDrawerPage("registration"),
        isHighlight: true,
      },
      {
        title: details?.modules.info?.title || "Product Info & Care",
        onClick: () => changeDrawerPage("info"),
        isHighlight: false,
      },
      {
        title:
          details?.modules.warranty?.warrantyStatus.status ||
          "Activate Warranty",
        onClick: () => changeDrawerPage("warranty"),
        isHighlight: false,
      },
      {
        title: details?.modules.shop?.title || "Shop the Collection",
        onClick: () => changeDrawerPage("shop"),
        isHighlight: false,
      },
      {
        title: details?.modules.sms?.title || "Become a Canopy Club VIP",
        onClick: () => changeDrawerPage("sms"),
        isHighlight: false,
      },
      {
        title: details?.modules.custom?.title || "Custom Drawer",
        onClick: () => changeDrawerPage("custom"),
        isHighlight: false,
      },
    ],
    [details, changeDrawerPage]
  );

  if (error) {
    // TODO: Write component for showing error modal
    // create error component here with msg

    //create an alert (component already exists)
    return <div>Error</div>;
  }

  return (
    <>
      <Wrapper
        width="100%"
        height="100%"
        direction="column"
        justifyContent="space-between"
        overflow="auto"
      >
        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            <PageHeader
              logo={logo(details?.brand.image ?? "")}
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
              <Image src={details?.product.image} alt="product" />
            </Wrapper>
          </>
        )}
      </Wrapper>
      <BottomDrawer
        title={pageTitle}
        buttons={buttonsArray}
        isChildOpen={isDrawerPageOpen}
        closeChild={closeDrawerPage}
      >
        {renderDrawerPage()}
      </BottomDrawer>
    </>
  );
};

export default ProductDetails;
