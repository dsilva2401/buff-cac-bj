import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { theme } from 'styles/theme';
import externalLinkWhite from 'assets/icons/svg/external-link-white.svg';
import externalLink from 'assets/icons/svg/external-link.svg';
import MulberryDrawer from 'components/MulberryDrawer';
import { ReactComponent as LoadingAnimation } from 'assets/icons/svg/loading.svg';
import { ReactComponent as Arrow } from 'assets/icons/svg/arrow-small.svg';
import { ReactComponent as MulberryLogo } from 'assets/logos/svg/mulberry-logo.svg';
import DataTable from 'components/DataTable';
import placeholder from 'assets/images/png/placeholder.png';
import AuthDrawer from 'components/AuthDrawer';
import BottomDrawer from 'components/BottomDrawer';
import { ButtonType } from 'components/BottomDrawer/BottomDrawer';
import CustomDrawer from 'components/CustomDrawer';
import IconButton from 'components/IconButton';
import Image from 'components/Image';
import PageHeader from 'components/PageHeader';
import ReferralDrawer from 'components/ReferralDrawer';
import ShopDrawer from 'components/ShopDrawer';
import Text from 'components/Text';
import useElementSize from 'hooks/useElementSize';
import { showToast } from 'components/Toast/Toast';
import WarrantyDrawer from 'components/WarrantyDrawer';
import Wrapper from 'components/Wrapper';
import { useTranslation } from 'react-i18next';
import ProgressiveImage from 'react-progressive-image';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import { CollectionItem } from 'types/User';
import { useAPI } from 'utils/api';
import { useGlobal } from '../../context/global/GlobalContext';
import { Animated } from 'react-animated-css';
import {
  CustomModuleType,
  LinkModuleType,
  ReferralModuleType,
  ShoppingModuleType,
  WarrantyModuleType,
} from '../../types/ProductDetailsType';
import HtmlWrapper from 'components/HtmlWrapper';

type UrlParam = {
  id: string;
};

const ProductDetails: React.FC = () => {
  const [isDrawerPageOpen, setIsDrawerPageOpen] = useState<boolean>(false);
  const [animateTable, toggleAnimateTable] = useState<boolean>(false);
  const [showCoverageTable, toggleCoverageTable] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string | undefined>('');
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [showAuthPage, setShowAuthPage] = useState<boolean>(false);
  const [disableModalDismiss, setDisableModalDismiss] =
    useState<boolean>(false);
  const {
    productDetails: details,
    loading,
    error,
    pageState,
    setSignInRedirect,
    setIsMenuOpen,
    setSlug,
    personalDetails,
    getPersonalDetails,
    user,
    previewEvent,
    isPreviewMode,
    previewAuthenticated,
    logEvent,
    retractDrawer
  } = useGlobal();

  const { id } = useParams<UrlParam>();
  const { t } = useTranslation('translation', { keyPrefix: 'productDetails' });
  const [tableRef, { height }] = useElementSize();

  const onSuccess = useCallback(() => {
    getPersonalDetails();
  }, [getPersonalDetails]);

  const onError = (error: any) => {
    showToast({ message: error.message, type: 'error' });
  };

  const closeDrawerPage = useCallback(() => {
    setCurrentPage(null);
    toggleAnimateTable(false);
    setIsDrawerPageOpen(false);
  }, []);

  const changeDrawerPage = useCallback(
    (index) => {
      setCurrentPage(index);
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
    [details, currentPage]
  );

  const [updateUser, addToLoading] = useAPI<any>({
    endpoint: 'auth/update',
    method: 'PUT',
    onSuccess,
    onError,
  });

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

  let buttonsArray = useMemo(() => {
    let buttons: ButtonType[] = [];
    if (details) {
      for (let x = 0; x < details?.modules?.length; x++) {
        if (details?.modules[x]?.locked) {
          setSignInRedirect(`/c/${id}`);
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
            if (details?.modules[x]?.type === 'LINK_MODULE') {
              let moduleData = module?.moduleInfo as LinkModuleType;
              window.open(`http://${moduleData?.link}`, '_blank');
            } else changeDrawerPage(x);
            logEvent({
              eventType: 'ENGAGEMENTS',
              event: 'MODULE_CLICKED',
              moduleType: module.type,
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
              <Image
                src={x === 0 ? externalLinkWhite : externalLink}
                margin='0 0 0 0.5rem'
                alt='external-link'
              />
            ) : null,
        };
        buttons.push(buttonObject);
      }

      const { product } = details || {};

      let showAddToCollectionButton = true;

      if (!user && showAddToCollectionButton) {
        showAddToCollectionButton = false;
      }

      if (product.registeredToCurrentUser && showAddToCollectionButton) {
        showAddToCollectionButton = false;
      }

      if (
        product.registered &&
        product.tagType === 'Unit' &&
        showAddToCollectionButton
      ) {
        showAddToCollectionButton = false;
      }

      if (showAddToCollectionButton) {
        let title = t('addToCollection');

        const productCollection =
          personalDetails?.profile?.productCollection || [];

        const existInCollection = productCollection.find(
          (productTag: CollectionItem) =>
            details?.tag?.slug === productTag.tagId
        );

        if (existInCollection) {
          title = t('removeFromCollection');
        }

        let onClick = () => {
          if (existInCollection) {
            updateUser({
              productCollection: [
                ...productCollection.filter(
                  (productTag) => productTag.tagId !== id
                ),
              ],
            });
            showToast({
              message: t('removeFromCollectionToast'),
              type: 'success',
            });
          } else {
            updateUser({
              productCollection: [
                ...productCollection,
                {
                  tagId: id,
                  brandId: details?.brand?.id,
                  productId: details?.product?.id,
                  variantId: null,
                },
              ],
            });
            showToast({ message: t('addToCollectionToast'), type: 'success' });
          }
        };
        buttons.push({
          title,
          onClick: onClick,
          isHighlight: false,
          locked: false,
          pageState: null,
          icon: addToLoading ? <LoadingAnimation width={32} /> : null,
        });
      }
    }
    return buttons;
  }, [
    changeDrawerPage,
    id,
    details,
    setSignInRedirect,
    personalDetails,
    user,
    logEvent,
    t,
    updateUser,
    addToLoading,
  ]);

  const leadModule: any = details?.leadModule || {};

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
        const { registeredTo } = leadModule?.moduleInfo || {};
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

        const { period, duration } = details?.warrantyInformation || {};
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

  const renderDrawerPage = useCallback(() => {
    if (details) {
      const module = details?.modules[currentPage as number];
      let moduleType: string | undefined = module?.type;

      if (
        (showAuthPage || module?.locked) &&
        (!isPreviewMode || !previewAuthenticated)
      ) {
        return (
          <Wrapper width='100%' direction='column'>
            {moduleType === 'WARRANTY_MODULE' && mulberryCoverage.coverage && (
              <Wrapper
                width='100%'
                direction='column'
                alignItems='center'
                justifyContent='flex-start'
                padding='0 0.75rem'
                gap='1rem'
              >
                <Wrapper width='100%'>
                  <MulberryLogo width='7.2rem' style={{ margin: '1.25rem 3rem 1.25rem 0rem' }} />
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
                    direction='column'
                    padding='1rem 0'
                    dangerouslySetInnerHTML={{ __html: `<p>HTML contetn for testing</p>` }}
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
                      <span>What is Covered?</span>
                    </Text>
                    <Arrow
                      style={{
                        transform: showCoverageTable ? 'rotate(0deg)' : 'rotate(180deg)',
                        transition: '0.4s'
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
                        style={{ transform: showCoverageTable ? 'translateY(0)' : 'translateY(-101%)' }}
                      >
                        <DataTable
                          headers={mulberryCoverage.headers}
                          tableData={mulberryCoverage.features}
                        />
                        <Wrapper
                          cursor='pointer'
                          alignItems='center'
                          alignSelf='flex-start'
                          justifyContent='flex-start'
                          onClick={() => window.open(`http://${mulberryCoverage.fullTermsLink}`, '_blank')}
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
              transition={animateTable ? '0.3s' : '0'}
              style={{ transform: !showCoverageTable ? `translateY(-${height}px)` : 'translateY(0)' }}
            >
              <AuthDrawer
                brandName={details?.brand?.name}
                animated={mulberryCoverage.coverage && moduleType === 'WARRANTY_MODULE'}
                html={details?.registration?.registrationText}
                onPersonalDetailshow={() => setDisableModalDismiss(true)}
                onAuthComplete={() => {
                  setShowAuthPage(false);
                  setDisableModalDismiss(false);
                }}
              />
            </Wrapper>
          </Wrapper>
        );
      }

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
            mulberryCoverage.coverage ? (
              <MulberryDrawer />
            ) : (
              <WarrantyDrawer
                closePage={closeDrawerPage}
                drawerTitle={details?.modules[currentPage as number]?.title}
                warrantyData={module?.moduleInfo as WarrantyModuleType}
                warrantyId={module?.id}
              />
            )
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
          return <ShopDrawer data={data} closePage={closeDrawerPage} />;
        default:
          return null;
      }
    }
  }, [
    currentPage,
    closeDrawerPage,
    details,
    showAuthPage,
    disableModalDismiss,
    previewAuthenticated,
    isPreviewMode,
    toggleAnimateTable,
    showCoverageTable,
    height,
    tableRef,
    t,
  ]);

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
          variant='dark'
          iconName='menu'
          onClick={handleOpenMenuClicked}
        />
      </Wrapper>
    ),
    [handleOpenMenuClicked]
  );

  if (error) return <Redirect to='/app/404' />;

  return (
    <>
      {details && (
        <Helmet>
          <title>{details?.brand?.name} by Brij</title>
        </Helmet>
      )}
      {details?.product?.image && (
        <ProgressiveImage
          src={details?.product?.image}
          placeholder={placeholder}
        >
          {(src: string, loading: boolean) => (
            <Image
              src={src}
              alt={details?.product?.name}
              position='absolute'
              width='100vw'
              margin='auto'
              objectFit='cover'
              transition='0.3s'
              opacity={loading ? 0.5 : 1}
              style={{ minHeight: '85vh' }}
            />
          )}
        </ProgressiveImage>
      )}
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
          actionButton={menuButton}
          border={false}
          transparent
        />
      </Wrapper>
      <BottomDrawer
        title={pageTitle}
        buttons={buttonsArray}
        loadingState={addToLoading || loading}
        socials={details?.brand?.social}
        isChildOpen={isDrawerPageOpen}
        closeChild={closeDrawerPage}
        leadInformation={leadInformation}
        disableModalDismiss={disableModalDismiss}
      >
        {renderDrawerPage()}
      </BottomDrawer>
    </>
  );
};

export default ProductDetails;

const mulberryCoverage = {
  coverage: false,
  fullTermsLink: 'www.google.com',
  headers: ["What's Covered", "mulberry", "Manu. Warranty"],
  features: [
    {
      title: 'Manufacturing defects',
      mulberry: true,
      manufacturerWarranty: true,
    },
    {
      title: 'Damange from stains, rips & tears',
      mulberry: true,
      manufacturerWarranty: false,
    },
    {
      title: 'Damage from liquid marks & rings',
      mulberry: true,
      manufacturerWarranty: false,
    },
    {
      title: 'Broken heating, reclining & vibration',
      mulberry: true,
      manufacturerWarranty: false,
    },
    {
      title: 'Broken mirrors & glass, loss of mirror silvering',
      mulberry: true,
      manufacturerWarranty: false,
    },
  ],
};
