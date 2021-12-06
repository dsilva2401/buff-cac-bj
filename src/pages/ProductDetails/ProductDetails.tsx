import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGlobal } from "../../context/global/GlobalContext";
import { ProductDetailsType } from "types/ProductDetailsType";
import { products } from "../../mocks/products";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { getAuth } from "firebase/auth";
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
  const [details, setDetails] = useState<ProductDetailsType | undefined>(
    undefined
  );
  const [isDrawerPageOpen, setIsDrawerPageOpen] = useState<boolean>(false);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<DrawerPages>(0);
  const [pageTitle, setPageTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { t } = useTranslation("translation", { keyPrefix: "productDetails" });
  const { setIsMenuOpen } = useGlobal();
  const { id } = useParams<UrlParam>();
  const auth = getAuth();

  // either to load data from local source or from an API call
  const localDataSource = true;

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) setAuthenticated(true);
      else setAuthenticated(false);
    });
  }, [auth]);

  useEffect(() => {
    if (id) {
      let product: ProductDetailsType | undefined;
      if (localDataSource === true) {
        product = products.find((product) => product.tag.slug === id);
        product ? setDetails(product) : setError(true);
      } else {
        // let myHeaders = new Headers();
        // let raw = "";
        // fetch(`https://damp-wave-40564.herokuapp.com/product/${id}`, {
        //   method: "GET",
        //   headers: myHeaders,
        //   body: raw,
        //   redirect: "follow",
        // })
        //   .then((result) => {
        //     setDetails(result.body)
        //   })
        //   .catch((error) => {
        //     console.log("ERROR CODE: ", error.code);
        //     console.log("ERROR MSG: ", error.message);
        //   });
      }
    }
    setLoading(false);
  }, [id, localDataSource]);

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
            isAuthenticated={isAuthenticated}
            registrationData={details?.modules.registration}
            setPageTitle={setPageTitle}
            closePage={closeDrawerPage}
          />
        );
      case DrawerPages.warranty:
        return (
          <WarrantyDrawer
            isAuthenticated={isAuthenticated}
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
  }, [currentPage, closeDrawerPage, details, isAuthenticated]);

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
