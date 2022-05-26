import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactComponent as Arrow } from 'assets/icons/svg/arrow-small.svg';
import { ReactComponent as MulberryLogo } from 'assets/logos/svg/mulberry-logo.svg';
import { ReactComponent as ExternalLink } from 'assets/icons/svg/external-link.svg';
import { ButtonType } from 'components/BottomDrawer/BottomDrawer';
import { useGlobal } from '../../context/global/GlobalContext';
import { MAGIC_ACTION } from 'context/global/GlobalProvider';
import { useTranslation } from 'react-i18next';
import { Animated } from 'react-animated-css';
import { useParams } from 'react-router';
import { Position } from 'types/Misc';
import { Helmet } from 'react-helmet';
import { theme } from 'styles/theme';
import Text from 'components/Text';
import Image from 'components/Image';
import AgeGate from 'components/AgeGate';
import DataTable from 'components/DataTable';
import IconButton from 'components/IconButton';
import PageHeader from 'components/PageHeader';
import AuthDrawer from 'components/AuthDrawer';
import HtmlWrapper from 'components/HtmlWrapper';
import BottomDrawer from 'components/BottomDrawer';
import RegistratonDrawer from 'components/RegistratonDrawer';
import externalLink from 'assets/icons/svg/external-link.svg';
import ProgressiveImage from 'react-progressive-image';
import useElementSize from 'hooks/useElementSize';
import useHeights from 'hooks/useHeights';
import Wrapper from 'components/Wrapper';
import {
  CustomModuleType,
  LinkModuleType,
  ModuleInfoType,
  ProductDetailsType,
  ReferralModuleType,
  ShoppingModuleType,
  WarrantyModuleType,
} from '../../types/ProductDetailsType';
import ProductHeroImage from './ProductHeroImage';
import LoadingIndicator from 'components/LoadingIndicator';
import FormDrawer from 'components/FormDrawer';
import { useHistory, useLocation } from 'react-router-dom';
import CustomDrawer from 'components/CustomDrawer';
import WarrantyDrawer from 'components/WarrantyDrawer';
import ReferralDrawer from 'components/ReferralDrawer';
import ShopDrawer from 'components/ShopDrawer';
import { FormDetailModel } from 'types/FormTypes';
import { FormProvider } from 'context/FormDrawerContext/FormDrawerProvider';

type UrlParam = {
  id: string;
};

const getWarrantyModule = (details: ProductDetailsType) => {
  return details?.modules?.find(
    (module: ModuleInfoType) => module?.type === 'WARRANTY_MODULE'
  );
};

interface Props {
  isFormNavigation?: boolean;
}

const ProductDetails: React.FC<Props> = ({ isFormNavigation = false }) => {
  const [isDrawerPageOpen, setIsDrawerPageOpen] = useState<boolean>(false);
  const [animateTable, toggleAnimateTable] = useState<boolean>(false);
  const [showCoverageTable, toggleCoverageTable] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string | undefined>('');
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [showAuthPage, setShowAuthPage] = useState<boolean>(false);
  const [mainDrawerOpen, setMainDrawerOpen] = useState<boolean>(false);
  const [isNewUser, setNewUser] = useState<boolean>(false);
  const { topHeight, bottomHeight } = useHeights();
  const { appZoom } = useGlobal();
  const { t } = useTranslation('translation', {
    keyPrefix: 'productDetails',
  });
  const history = useHistory();
  const location = useLocation();

  const [position, setPosition] = useState<Position>({
    x: 0,
    y: bottomHeight,
  });

  const [disableModalDismiss, setDisableModalDismiss] =
    useState<boolean>(false);
  const {
    productDetails: details,
    pageState,
    setSignInRedirect,
    setIsMenuOpen,
    setSlug,
    user,
    previewEvent,
    isPreviewMode,
    previewAuthenticated,
    setPreviewAuthenticated,
    logEvent,
    retractDrawer,
    setMagicAction,
    setMagicPayload,
    magicAction,
    magicPayload,
    agegateDisplay,
    toggleAgegateDisplay,
    brandTheme,
    loading,
    setProductModule,
    alreadySignedIn,
    setAlreadySignIn,
  } = useGlobal();

  const { id } = useParams<UrlParam>();
  const [tableRef, { height }] = useElementSize();

  const closeDrawerPage = useCallback((closeDrawer = false) => {
    setCurrentPage(null);
    setNewUser(false);
    toggleAnimateTable(false);
    setIsDrawerPageOpen(false);
    if (closeDrawer && isFormNavigation) {
      setTimeout(() => {
        history.replace(`/c/${id}`);
      }, 0);
    }
  }, []);

  useEffect(() => {
    // for enabling back button to correct path and form module.
    if (location.pathname === `/c/${id}`) {
      closeDrawerPage();
    }
  }, [location.pathname, closeDrawerPage, id]);

  const changeDrawerPage = useCallback(
    (index) => {
      setCurrentPage(index);

      // refactor this to be controlled from module config

      const newModule = details?.modules[index];

      setMagicAction(MAGIC_ACTION.OPEN_MODULE);
      setMagicPayload({
        moduleId: newModule?.id,
      });

      if (currentPage) {
        const moduleType = details?.modules[currentPage]?.type;
        setIsDrawerPageOpen(moduleType !== 'LINK_MODULE');
        if (moduleType !== 'LINK_MODULE')
          setPageTitle(details?.modules[index].title);
      } else {
        setIsDrawerPageOpen(true);
        setPageTitle(details?.modules[index].title);
      }
    },
    [details, currentPage, setMagicPayload, setMagicAction]
  );

  useEffect(() => {
    if (id && details) {
      logEvent({
        eventType: 'ENGAGEMENTS',
        event: 'USER_SCAN_A_TAG',
        data: id,
      });
    }
  }, [id, details, logEvent]);

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

  useEffect(() => {
    const event = previewEvent;
    if (event && event.type === 'changeDrawerPage') {
      changeDrawerPage(event.data);
    } else if (event && event.type === 'closeDrawerPage') {
      closeDrawerPage();
    }
  }, [previewEvent, changeDrawerPage, closeDrawerPage]);

  // automatically open module upon redirect
  useEffect(() => {
    if (isFormNavigation && details?.modules?.length) {
      //find
      const moduleIndex = details?.modules.findIndex(
        (module) => module.type === 'FORMS_MODULE'
      );
      if (moduleIndex >= 0) {
        setMagicAction(MAGIC_ACTION.OPEN_MODULE);
        changeDrawerPage(moduleIndex);
        setPosition({ x: 0, y: topHeight });
        setMainDrawerOpen(true);
      }
    }
  }, [isFormNavigation, details, topHeight, changeDrawerPage, setMagicAction]);

  useEffect(() => {
    if (
      magicAction === MAGIC_ACTION.OPEN_MODULE &&
      user &&
      details?.modules?.length
    ) {
      const { moduleId } = magicPayload;

      const moduleIndex = details?.modules?.findIndex(
        (moduleDetail) => moduleDetail.id === moduleId
      );
      if (moduleIndex !== -1) {
        changeDrawerPage(moduleIndex);
        setPosition({ x: 0, y: topHeight });
        setMainDrawerOpen(true);
      }

      setMagicAction(MAGIC_ACTION.REDIRECT);
    }
  }, [
    magicPayload,
    changeDrawerPage,
    setMagicAction,
    magicAction,
    user,
    currentPage,
    details,
    topHeight,
  ]);

  useEffect(() => {
    if (!isPreviewMode) {
      details?.product?.ageGateEnabled &&
        !agegateDisplay &&
        toggleAgegateDisplay(true);
    }
  }, [details, agegateDisplay, toggleAgegateDisplay, isPreviewMode]);

  useEffect(() => {
    if (details?.brand?.customAccentColor)
      localStorage.setItem('accentColor', details?.brand?.customAccentColor);
    else localStorage.setItem('accentColor', '');
  }, [details]);

  useEffect(() => {
    if (details) {
      for (let x = 0; x < details?.modules?.length; x++) {
        if (details?.modules[x]?.locked) {
          setSignInRedirect(`/c/${id}`);
        }
      }
    }
  }, [details, setSignInRedirect, id]);

  let buttonsArray = useCallback(() => {
    let buttons: ButtonType[] = [];
    if (details) {
      for (let x = 0; x < details?.modules?.length; x++) {
        let title: string = details.modules[x].title;
        switch (details.modules[x].type) {
          case 'WARRANTY_MODULE':
            const moduleInfo = details.modules[x]
              .moduleInfo as WarrantyModuleType;
            title = moduleInfo?.activated
              ? t('viewWarranty')
              : details.modules[x].title;
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
            setProductModule(module.id);
            if (details?.modules[x]?.type === 'LINK_MODULE') {
              let moduleData = module?.moduleInfo as LinkModuleType;
              window.open(
                moduleData?.link.includes('https://') ||
                  moduleData?.link.includes('http://')
                  ? moduleData?.link
                  : `https://${moduleData?.link}`,
                '_blank'
              );
            } else changeDrawerPage(x);
            logEvent({
              eventType: 'ENGAGEMENTS',
              event: 'MODULE_CLICKED',
              moduleType: module.type,
              moduleId: module.id,
            });
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
          icon:
            details?.modules[x].type === 'LINK_MODULE' ? (
              <ExternalLink
                width={24}
                style={{ position: 'relative' }}
                fill={x === 0 ? '#ffffff' : brandTheme}
              />
            ) : null,
        };
        buttons.push(buttonObject);
      }
    }
    return buttons;
  }, [
    changeDrawerPage,
    id,
    details,
    setSignInRedirect,
    logEvent,
    brandTheme,
    setProductModule,
  ]);

  const leadModule: any = useMemo(() => {
    return details?.leadModule || {};
  }, [details]);

  const leadInformation = useMemo(() => {
    switch (leadModule.type) {
      case 'SHOPPING_MODULE':
        const defaultVariantDetails =
          leadModule?.moduleInfo?.defaultVariantDetails;

        const price = defaultVariantDetails?.price || 0;
        const discountedPrice = defaultVariantDetails?.discountedPrice;

        if (!discountedPrice) {
          return (
            <Text fontSize='1rem' fontWeight='600'>
              <span>{`$${price}`}</span>
            </Text>
          );
        }

        return (
          <Wrapper direction='column' alignItems='flex-end'>
            <Text textDecoration='line-through' fontSize='0.8rem' color='grey'>
              <span>{`$${price}`}</span>
            </Text>
            <Text fontSize='1rem' fontWeight='600'>
              <span>{`$${discountedPrice}`}</span>
            </Text>
          </Wrapper>
        );
      case 'WARRANTY_MODULE':
        const { registeredTo, period, duration } = leadModule?.moduleInfo || {};
        const tagType = details?.product?.tagType;

        if (registeredTo && tagType === 'Unit') {
          return (
            <Wrapper direction='column' alignItems='flex-end'>
              <Text height='20px' fontSize='0.8rem'>
                <span>Registered To</span>
              </Text>
              <Text fontSize='0.8rem' fontWeight='600'>
                <span>{registeredTo}</span>
              </Text>
            </Wrapper>
          );
        }

        if (!period && !duration) return null;

        return (
          <Wrapper direction='column' alignItems='flex-end'>
            <Text height='20px' fontSize='0.7rem'>
              <span>Warranty</span>
            </Text>
            <Text fontSize='0.7rem' fontWeight='600'>
              <span>{`${period} ${duration?.label}`}</span>
            </Text>
          </Wrapper>
        );
      default:
        return null;
    }
  }, [leadModule, details]);

  const onAuthComplete = useCallback(
    (isNewUser?: boolean) => {
      if (!isPreviewMode) {
        setNewUser(isNewUser as boolean);
      } else {
        setPreviewAuthenticated(true);
      }
      setShowAuthPage(false);
      setDisableModalDismiss(false);
    },
    [isPreviewMode, setPreviewAuthenticated]
  );

  const renderDrawerPage = useCallback(() => {
    if (details) {
      const module = details?.modules[currentPage as number];
      let moduleType: string | undefined = module?.type;
      let mulberry: WarrantyModuleType['mulberry'] | null = null;
      if (module?.moduleInfo) {
        const warrantyModuleInfo = module?.moduleInfo as WarrantyModuleType;
        mulberry = warrantyModuleInfo.mulberry;
      }
      if (!mulberry) {
        let result = details?.modules?.findIndex(
          (element) => element.type === 'WARRANTY_MODULE'
        );
        const module = details?.modules[result as number];
        if (module?.moduleInfo) {
          const warrantyModuleInfo = module?.moduleInfo as WarrantyModuleType;
          mulberry = warrantyModuleInfo.mulberry;
        }
      }

      if (showAuthPage && (!isPreviewMode || !previewAuthenticated)) {
        return (
          <Wrapper
            width='100%'
            direction='column'
            transition='0.3s'
            height={
              showCoverageTable ? '100%' : `calc(100% - ${height - 100}px)`
            }
          >
            {mulberry && (
              <Wrapper
                gap='1rem'
                width='100%'
                direction='column'
                alignItems='center'
                padding='0 0.75rem'
                justifyContent='flex-start'
                transition={animateTable ? '0.3s' : '0'}
              >
                <Wrapper width='100%'>
                  <MulberryLogo
                    width='7.2rem'
                    style={{
                      margin: '1.25rem 3rem 1.25rem 0rem',
                    }}
                  />
                </Wrapper>
                <Animated
                  animationIn='slideInRight'
                  animationOut='slideOutLeft'
                  animationInDuration={retractDrawer ? 0 : 300}
                  animationOutDuration={retractDrawer ? 0 : 300}
                  animationInDelay={retractDrawer ? 200 : 0}
                  isVisible={true}
                >
                  <HtmlWrapper
                    width='100%'
                    padding='1rem 0'
                    direction='column'
                    dangerouslySetInnerHTML={{
                      __html: details?.registration?.registrationText,
                    }}
                  />
                  <Wrapper
                    width='100%'
                    gap='0.5rem'
                    cursor='pointer'
                    alignItems='center'
                    justifyContent='center'
                    onClick={() => {
                      toggleCoverageTable(!showCoverageTable);
                      toggleAnimateTable(true);
                    }}
                  >
                    <Text
                      fontSize='1rem'
                      fontWeight='600'
                      color='#202029'
                      textDecoration='underline'
                    >
                      <span>View Details</span>
                    </Text>
                    <Arrow
                      style={{
                        transform: showCoverageTable
                          ? 'rotate(0deg)'
                          : 'rotate(180deg)',
                        transition: '0.4s',
                      }}
                    />
                  </Wrapper>
                  <Wrapper overflow='hidden'>
                    <Wrapper paddingTop='1px'>
                      <Wrapper
                        ref={tableRef}
                        height='100%'
                        gap='0.5rem'
                        transition='0.3s'
                        paddingTop='2rem'
                        direction='column'
                        style={{
                          transform: showCoverageTable
                            ? 'translateY(0)'
                            : 'translateY(-101%)',
                        }}
                      >
                        <DataTable
                          headers={[
                            "What's Covered",
                            'mulberry',
                            'Manu. Warranty',
                          ]}
                          tableData={mulberry?.coverages}
                        />
                        <Wrapper
                          cursor='pointer'
                          alignItems='center'
                          alignSelf='flex-start'
                          justifyContent='flex-start'
                          onClick={() =>
                            window.open(mulberry?.policyTermsUrl, '_blank')
                          }
                        >
                          <Image
                            width='0.875rem'
                            src={externalLink}
                            margin='-0.05rem 0.25rem 0 0'
                            alt='external-link'
                          />
                          <Text
                            fontSize='0.75rem'
                            fontWeight='500'
                            color={theme.primary}
                          >
                            <p>See full terms</p>
                          </Text>
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                  </Wrapper>
                </Animated>
              </Wrapper>
            )}
            <Wrapper
              width='100%'
              direction='column'
              height='100%'
              transition={animateTable ? '0.3s' : '0'}
              style={{
                transform: !showCoverageTable
                  ? `translateY(-${height}px)`
                  : 'translateY(0)',
              }}
            >
              <AuthDrawer
                brandName={details?.brand?.name}
                html={mulberry ? null : details?.registration?.registrationText}
                animated={!!mulberry}
                showMulberryTerms={!!mulberry}
                onAuthComplete={onAuthComplete}
                onAuthOpen={() => {
                  // If the authdrawer was open that implies
                  // the user was not signed in before
                  setAlreadySignIn(false);
                }}
              />
            </Wrapper>
          </Wrapper>
        );
      }

      const renderOtherModules = () => {
        switch (moduleType) {
          case 'CUSTOM_MODULE':
            return (
              <CustomDrawer
                drawerTitle={details?.modules[currentPage as number]?.title}
                drawerData={module?.moduleInfo as CustomModuleType}
              />
            );
          case 'WARRANTY_MODULE':
            return (
              <WarrantyDrawer
                closePage={closeDrawerPage}
                drawerTitle={details?.modules[currentPage as number]?.title}
                warrantyData={module?.moduleInfo as WarrantyModuleType}
                warrantyId={module?.id}
              />
            );
          case 'REFERRAL_MODULE':
            return (
              <ReferralDrawer
                drawerTitle={details?.modules[currentPage as number]?.title}
                referralData={module?.moduleInfo as ReferralModuleType}
              />
            );
          case 'SHOPPING_MODULE':
            const data = details?.modules[currentPage as number]
              ?.moduleInfo as ShoppingModuleType;
            return (
              <ShopDrawer
                data={data}
                closePage={closeDrawerPage}
                minimizeBranding={details.brand.minimizeBranding}
                productDescription={details.product.productDescription}
                brand={details?.brand}
              />
            );
          case 'FORMS_MODULE':
            const dataForm = details?.modules[currentPage as number]
              ?.moduleInfo as FormDetailModel[];
            return <FormDrawer data={dataForm} />;
          default:
            return null;
        }
      };

      const warrantyModule = getWarrantyModule(details);

      return (
        <RegistratonDrawer
          warrantyData={warrantyModule}
          warrantyId={warrantyModule?.id as string}
          currentModule={module}
          closePage={closeDrawerPage}
          product={details?.product}
          isNewUser={isNewUser}
          onUserUpdate={() => setNewUser(false)}
          setDisableModalDismiss={setDisableModalDismiss}
          alreadySignedIn={alreadySignedIn}
          registrationData={details?.registration}
          brandName={details?.brand?.name}
          html={mulberry ? null : details?.registration?.registrationText}
          showMulberryTerms={!!mulberry}
        >
          <FormProvider>{renderOtherModules()}</FormProvider>
        </RegistratonDrawer>
      );
    }
  }, [
    currentPage,
    animateTable,
    isNewUser,
    retractDrawer,
    closeDrawerPage,
    details,
    showAuthPage,
    previewAuthenticated,
    isPreviewMode,
    toggleAnimateTable,
    showCoverageTable,
    height,
    tableRef,
    onAuthComplete,
    alreadySignedIn,
    setAlreadySignIn,
  ]);

  const logo = useCallback(
    (image: string) => <Image src={image} alt='brand-logo' maxWidth='110px' />,
    []
  );

  const menuButton = () => (
    <Wrapper width='100%' justifyContent='flex-end'>
      <IconButton
        variant='dark'
        iconName='menu'
        onClick={() => setIsMenuOpen(true)}
      />
    </Wrapper>
  );

  return (
    <>
      {details && <AgeGate />}
      {details && (
        <Helmet>
          <title>{details?.brand?.name} by Brij</title>
        </Helmet>
      )}
      {loading ? (
        <>
          <ProductHeroImage />
          <Wrapper
            width='100%'
            height='100%'
            direction='column'
            justifyContent='space-between'
            overflow='auto'
            position='relative'
          >
            <LoadingIndicator />
          </Wrapper>
        </>
      ) : (
        <>
          <ProductHeroImage />
          <Wrapper
            width='100%'
            height='100%'
            direction='column'
            justifyContent='space-between'
            overflow='auto'
            position='relative'
          >
            <PageHeader
              logo={logo(details?.brand?.image ?? '')}
              actionButton={menuButton()}
              border={false}
              transparent
            />
          </Wrapper>
        </>
      )}
      {details?.modules?.length && (
        <BottomDrawer
          title={pageTitle}
          subtitle={details?.product?.subtitle}
          buttons={buttonsArray()}
          socials={details?.brand?.social}
          isChildOpen={isDrawerPageOpen}
          closeChild={closeDrawerPage}
          leadInformation={leadInformation}
          disableModalDismiss={disableModalDismiss}
          mainDrawerOpen={mainDrawerOpen}
          setMainDrawerOpen={setMainDrawerOpen}
          position={position}
          setPosition={setPosition}
        >
          {renderDrawerPage()}
        </BottomDrawer>
      )}
    </>
  );
};

export default ProductDetails;
