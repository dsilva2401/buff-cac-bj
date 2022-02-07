import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CustomModuleType,
  LinkModuleType,
  ReferralModuleType,
  ShoppingModuleType,
  WarrantyModuleType,
} from '../../types/ProductDetailsType';
import { useAPI } from 'utils/api';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showToast } from 'components/Toast/Toast';
import { useGlobal } from '../../context/global/GlobalContext';
import { ButtonType } from 'components/BottomDrawer/BottomDrawer';
import { ReactComponent as LoadingAnimation } from 'assets/icons/svg/loading.svg';
import externalLinkWhite from 'assets/icons/svg/external-link-white.svg';
import externalLink from 'assets/icons/svg/external-link.svg';
import placeholder from 'assets/images/png/placeholder.png';
import ProgressiveImage from 'react-progressive-image';
import WarrantyDrawer from 'components/WarrantyDrawer';
import ReferralDrawer from 'components/ReferralDrawer';
import BottomDrawer from 'components/BottomDrawer';
import CustomDrawer from 'components/CustomDrawer';
import AuthDrawer from 'components/AuthDrawer';
import IconButton from 'components/IconButton';
import PageHeader from 'components/PageHeader';
import ShopDrawer from 'components/ShopDrawer';
import useLogEvent from 'hooks/useLogEvent';
import Wrapper from 'components/Wrapper';
import Image from 'components/Image';
import Text from 'components/Text';
import { CollectionItem } from 'types/User';

type UrlParam = {
  id: string;
};

const ProductDetails: React.FC = () => {
  const logEvent = useLogEvent();

  const [isDrawerPageOpen, setIsDrawerPageOpen] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string | undefined>('');
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [showAuthPage, setShowAuthPage] = useState<boolean>(false);
  const [disableModalDismiss, setDisableModalDismiss] = useState<boolean>(false);
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
    previewAuthenticated
  } = useGlobal();

  const { id } = useParams<UrlParam>();
  const { t } = useTranslation('translation', { keyPrefix: 'productDetails' });

  const onSuccess = useCallback(() => {
    getPersonalDetails()
  }, [getPersonalDetails]);

  const onError = (error: any) => {
    showToast({ message: error.message, type: 'error' })
  }

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

  const [updateUser, addToLoading] = useAPI<any>({
    endpoint: 'auth/update',
    method: 'PUT',
    onSuccess,
    onError
  })

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
      closeDrawerPage()
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
              let moduleData = module?.moduleInfo as LinkModuleType
              window.open(moduleData?.link, "_blank");
            } else changeDrawerPage(x);
            logEvent({
              type: 'EVENT_MODULE',
              name: 'MODULE_CLICKED',
              data: {
                details: {
                  moduleId: module.id,
                  moduleName: module.type,
                },
              },
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
          icon: details?.modules[x].type === 'LINK_MODULE' ?
            <Image
              src={x === 0 ? externalLinkWhite : externalLink}
              margin='0 0 0 0.5rem'
              alt='external-link'
            />
            :
            null,
        };
        buttons.push(buttonObject);
      }

      const { product } = details || {}

      let showAddToCollectionButton = true;

      if (!user && showAddToCollectionButton) {
        showAddToCollectionButton = false;
      }

      if (product.registeredToCurrentUser && showAddToCollectionButton) {
        showAddToCollectionButton = false;
      }

      if (product.registered && product.tagType === "Unit" && showAddToCollectionButton) {
        showAddToCollectionButton = false;
      }

      if (showAddToCollectionButton) {
        let title = t('addToCollection');

        const productCollection = personalDetails?.profile?.productCollection || [];

        const existInCollection = productCollection.find(
          (productTag: CollectionItem) => details?.tag?.slug === productTag.tagId
        );

        if (existInCollection) {
          title = t('removeFromCollection');
        };

        let onClick = () => {
          if (existInCollection) {
            updateUser({
              productCollection: [...productCollection.filter(productTag => productTag.tagId !== id)]
            })
            showToast({ message: t('removeFromCollectionToast'), type: 'success'});
          } else {
            updateUser({
              productCollection: [...productCollection, {
                tagId: id,
                brandId: details?.brand?.id,
                productId: details?.product?.id,
                variantId: null
              }]
            })
            showToast({ message: t('addToCollectionToast'), type: 'success'});
          }
        }
        buttons.push({
          title,
          onClick: onClick,
          isHighlight: false,
          locked: false,
          pageState: null,
          icon: addToLoading ? <LoadingAnimation width={32} /> : null
        });
      };
    };
    return buttons;
  }, [changeDrawerPage, id, details, setSignInRedirect, personalDetails, user, logEvent, t, updateUser]);

  const leadModule: any = details?.leadModule || {};

  const leadInformation = useMemo(() => {
    switch (leadModule.type) {
      case 'SHOPPING_MODULE':
        const defaultVariantDetails = leadModule?.moduleInfo?.defaultVariantDetails;

        const price = defaultVariantDetails?.price || 0;
        const discountedPrice = defaultVariantDetails?.discountedPrice;

        if (!discountedPrice) {
          return (
            <Text fontSize='1rem' fontWeight='600'>
              <span>{`$${price}`}</span>
            </Text>
          );
        };

        return (
          <Wrapper direction='column' alignItems='flex-end'>
            <Text textDecoration='line-through' fontSize='0.8rem' color='grey'>
              <span>{`$${price}`}</span>
            </Text>
            <Text fontSize='1rem' fontWeight='600'>
              <span>{`$${discountedPrice}`}</span>
            </Text>
          </Wrapper>
        )
      case 'WARRANTY_MODULE':
        const { registeredTo } = leadModule?.moduleInfo || {};
        const tagType = details?.product?.tagType;

        if (registeredTo && tagType === 'Unit') {
          return (
            <Wrapper
              direction='column'
              alignItems='flex-end'
            >
              <Text height='20px' fontSize='0.8rem'>
                <span>Registered To</span>
              </Text>
              <Text fontSize='0.8rem' fontWeight='600'>
                <span>{registeredTo}</span>
              </Text>
            </Wrapper>
          );
        };

        const { period, duration } = details?.warrantyInformation || {}
        if (!period && !duration) return null;

        return (
          <Wrapper
            direction='column'
            alignItems='flex-end'
          >
            <Text height='20px' fontSize='0.7rem'>
              <span>Warranty</span>
            </Text>
            <Text fontSize='0.7rem' fontWeight='600'>
              <span>{`${period} ${duration?.label}`}</span>
            </Text>
          </Wrapper>
        )
      default:
        return null;
    }
  }, [leadModule, details]);

  const renderDrawerPage = useCallback(() => {
    if (details) {
      const module = details?.modules[currentPage as number];
      let moduleType: string | undefined = module?.type;

      if ((showAuthPage || module?.locked) && (!isPreviewMode || !previewAuthenticated)) {
        return (
          <AuthDrawer
            html={details?.registration?.registrationText}
            onPersonalDetailshow={() => setDisableModalDismiss(true)}
            showFooter={!disableModalDismiss}
            onAuthComplete={() => {
              setShowAuthPage(false)
              setDisableModalDismiss(false)
            }}
          />
        )
      }

      switch (moduleType) {
        case 'CUSTOM_MODULE':
          return (
            <CustomDrawer
              drawerTitle={details?.modules[currentPage as number]?.title}
              drawerData={
                module?.moduleInfo as CustomModuleType
              }
            />
          );
        case 'WARRANTY_MODULE':
          return (
            <WarrantyDrawer
              closePage={closeDrawerPage}
              drawerTitle={details?.modules[currentPage as number]?.title}
              warrantyData={
                module?.moduleInfo as WarrantyModuleType
              }
              warrantyId={module?.id}
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
  }, [currentPage, closeDrawerPage, details, showAuthPage, disableModalDismiss, previewAuthenticated]);

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

  if (error) return <Redirect to='/404' />;

  return (
    <>
      {details && (
        <Helmet>
          <title>{details?.brand?.name} by Brij</title>
        </Helmet>
      )}
      {details?.product?.image && (
        <ProgressiveImage src={details?.product?.image} placeholder={placeholder}>
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
