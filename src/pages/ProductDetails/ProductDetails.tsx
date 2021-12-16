import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGlobal } from "../../context/global/GlobalContext";
import { PageStateType } from "context/global/GlobalContext";
import { useParams } from "react-router";
import {
  LinkModuleType,
  CustomModuleType,
  ReferralModuleType,
  WarrantyModuleType,
} from "../../types/ProductDetailsType";
import Image from "components/Image";
import Wrapper from "components/Wrapper";
import CustomDrawer from "components/CustomDrawer";
import BottomDrawer from "components/BottomDrawer";
import ReferralDrawer from "components/ReferralDrawer";
import WarrantyDrawer from "components/WarrantyDrawer";
import LoadingIndicator from "components/LoadingIndicator";
import IconButton from "components/IconButton";
import LinkModule from "components/LinkModule";
import PageHeader from "components/PageHeader";

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
  }, [isDrawerPageOpen, details, currentPage]);

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
          console.log(
            "WARRANTY DATA: ",
            details?.modules[currentPage]?.moduleInfo
          );
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
