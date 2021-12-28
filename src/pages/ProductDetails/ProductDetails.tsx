
import { Redirect } from "react-router-dom";
import AuthDrawer from "components/AuthDrawer";
import BottomDrawer from "components/BottomDrawer";
import { ButtonType } from "components/BottomDrawer/BottomDrawer";
import CustomDrawer from "components/CustomDrawer";
import IconButton from "components/IconButton";
import Image from "components/Image";
import LinkModule from "components/LinkModule";
import PageHeader from "components/PageHeader";
import ReferralDrawer from "components/ReferralDrawer";
import ShopDrawer from "components/ShopDrawer";
import WarrantyDrawer from "components/WarrantyDrawer";
import Wrapper from "components/Wrapper";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useGlobal } from "../../context/global/GlobalContext";
import {
  CustomModuleType,
  LinkModuleType,
  ReferralModuleType,
  ShoppingModuleType,
  WarrantyModuleType,
} from '../../types/ProductDetailsType';
import Text from "components/Text";

type UrlParam = {
  id: string;
};

const ProductDetails: React.FC = () => {
  const [isDrawerPageOpen, setIsDrawerPageOpen] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string | undefined>('');
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [showAuthPage, setShowAuthPage] = useState<boolean>(false);
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
    setCurrentPage(null);
    setIsDrawerPageOpen(false);
  }, []);

  const changeDrawerPage = useCallback(
    (index) => {
      setCurrentPage(index);

      if (currentPage) {
        const moduleType = details?.modules[currentPage]?.type
        setIsDrawerPageOpen(moduleType !== 'LINK_MODULE');

        if (moduleType !== 'LINK_MODULE')
          setPageTitle(details?.modules[index].title);
      } else {
        setIsDrawerPageOpen(true);
        setPageTitle(details?.modules[index].title);
      }
    },
    [details, currentPage]
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
          case 'WARRANTY_MODULE':
            const moduleInfo = details.modules[x]
              .moduleInfo as WarrantyModuleType;
            title = moduleInfo?.activated
              ? 'View Warranty'
              : 'Activate Warranty';
            break;
          default:
            title = details.modules[x].title;
            break;
        }
        let buttonObject: ButtonType = {
          title,
          onClick: () => {
            const module = details?.modules[x];
            setShowAuthPage(module?.locked);
            changeDrawerPage(x)
          },
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

  const leadModule: any = details?.modules[0] || {}

  const leadInformation = useMemo(() => {
    switch (leadModule.type) {
      case 'SHOPPING_MODULE':
        const defaultVariantDetails = leadModule?.moduleInfo?.defaultVariantDetails;

        return (
          <Text fontSize="1rem" fontWeight="600">
            <span>{defaultVariantDetails?.price && `$${defaultVariantDetails?.price}`}</span>
            <span>{defaultVariantDetails?.discountedPrice && `$${defaultVariantDetails?.discountedPrice}`}</span>
          </Text>
        )
      case 'WARRANTY_MODULE':
        return (
          <Text fontSize="1rem" fontWeight="600">
            <span>{leadModule?.moduleInfo?.registeredTo}</span>
          </Text>
        )
      default:
        return null;
    }
  }, [leadModule]);

  const renderDrawerPage = useCallback(() => {
    if (details) {
      const module = details?.modules[currentPage  as number];
      let moduleType: string | undefined = module?.type;

      if (showAuthPage || module?.locked) {
        return (
          <AuthDrawer
            html={details?.brand?.registrationDetails}
            onAuthComplete={() => setShowAuthPage(false)}
          />
        )
      }

      switch (moduleType) {
        case 'CUSTOM_MODULE':
          return (
            <CustomDrawer
              drawerTitle={details?.modules[currentPage  as number]?.title}
              drawerData={
                module?.moduleInfo as CustomModuleType
              }
            />
          );
        case 'WARRANTY_MODULE':
          return (
            <WarrantyDrawer
              closePage={closeDrawerPage}
              drawerTitle={details?.modules[currentPage  as number]?.title}
              warrantyData={
                module?.moduleInfo as WarrantyModuleType
              }
              warrantyId={module?.id}
            />
          );
        case 'LINK_MODULE':
          return (
            <LinkModule
              closePage={closeDrawerPage}
              moduleData={
                module?.moduleInfo as LinkModuleType
              }
            />
          );
        case 'REFERRAL_MODULE':
          return (
            <ReferralDrawer
              drawerTitle={details?.modules[currentPage as number]?.title}
              referralData={
                module?.moduleInfo as ReferralModuleType
              }
            />
          );
        case 'SHOPPING_MODULE':
          const data = details?.modules[currentPage as number]
            ?.moduleInfo as ShoppingModuleType;
          return <ShopDrawer data={data} closePage={closeDrawerPage} />;
        default:
          return null;
      }
    }
  }, [currentPage, closeDrawerPage, details, showAuthPage]);

  const logo = useCallback(
    (image: string) => <Image src={image} alt='brand-logo' maxWidth='110px' />,
    []
  );

  const handleOpenMenuClicked = useCallback(
    () => setIsMenuOpen(true),
    [setIsMenuOpen]
  );

  const menuButton = useMemo(
    () => (
      <Wrapper width='100%' justifyContent='flex-end'>
        <IconButton
          theme='dark'
          iconName='menu'
          onClick={handleOpenMenuClicked}
        />
      </Wrapper>
    ),
    [handleOpenMenuClicked]
  );

  if (error) return <Redirect to='/404' />;

  return (
    <>
      <>
          <Wrapper
            width='100%'
            height='100%'
            direction='column'
            justifyContent='space-between'
            overflow='auto'
          >
            <PageHeader
              logo={logo(details?.brand?.image ?? '')}
              actionButton={menuButton}
              border={false}
            />
            <Wrapper
              width='100%'
              height='100%'
              justifyContent='center'
              alignItems='flex-start'
              padding='2rem 1rem'
              responsiveImg
            >
              <Image src={details?.product?.image} alt='product' />
            </Wrapper>
          </Wrapper>
          <BottomDrawer
            title={pageTitle}
            buttons={buttonsArray}
            socials={details?.brand?.social}
            isChildOpen={isDrawerPageOpen}
            closeChild={closeDrawerPage}
            leadInformation={leadInformation}
          >
            {renderDrawerPage()}
          </BottomDrawer>
        </>
    </>
  );
};

export default ProductDetails;
