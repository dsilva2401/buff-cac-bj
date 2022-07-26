import React, { useCallback, useEffect, useState } from 'react';
import { getRegisterText } from 'utils/getRegisterText';
import {
  Product,
  ModuleInfoType,
  WarrantyModuleType,
} from '../../types/ProductDetailsType';
import { useGlobal } from '../../context/global/GlobalContext';
import { showToast } from 'components/Toast/Toast';
import { useTranslation } from 'react-i18next';
import PersonalDetails from 'components/PersonalDetails';
import HtmlWrapper from 'components/HtmlWrapper';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Text from 'components/Text';
import dayjs, { ManipulateType } from 'dayjs';
import useRegisterProduct from 'hooks/useRegisterProduct';
import { useSuccessDrawerContext } from 'context/SuccessDrawerContext/SuccessDrawerContext';
import getSuccessTitle from 'utils/getSuccessTitle';

enum PageType {
  CURRENT_MODULE = 'CURRENT_MODULE',
  PERSONAL_DETAILS_FORM = 'PERSONAL_DETAILS_FORM',
  PRE_REGISTER = 'PRE_REGISTER',
  NONE = 'NONE',
}

type RegistrationDrawerProps = {
  closePage(): void;
  warrantyId: string;
  warrantyData?: WarrantyModuleType | any;
  children: React.ReactElement<any, any> | null;
  product: Product;
  currentModule: ModuleInfoType;
  isNewUser: boolean;
  onUserUpdate: () => void;
  setDisableModalDismiss: (dismissModal: boolean) => void;
  alreadySignedIn: boolean;
  registrationData: any;
  html: string | undefined | null;
  brandName?: string;
  showMulberryTerms?: boolean;
};

const RegistrationDrawer: React.FC<RegistrationDrawerProps> = ({
  closePage,
  warrantyData,
  warrantyId,
  children,
  product,
  currentModule,
  isNewUser,
  onUserUpdate,
  setDisableModalDismiss,
  alreadySignedIn,
  registrationData,
  html,
  brandName,
  showMulberryTerms,
}) => {
  const [productRegistered, setProductRegistered] = useState<boolean>(false);
  const [pageToShow, setPageToShow] = useState<PageType>(PageType.NONE);
  const [productRegisterCallMade, setProductRegisterCallMade] =
    useState<boolean>(false);
  const {
    user,
    slug,
    token,
    brandTheme,
    isPreviewMode,
    setProductDetails,
    productDetails,
    setRegisteringProduct,
  } = useGlobal();

  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.authDrawer',
  });

  const { t: registrationTranslation } = useTranslation('translation', {
    keyPrefix: 'registration',
  });

  const { registerProductAndFetch } = useRegisterProduct();

  const { openDrawer, setMeta, showSuccess, open } = useSuccessDrawerContext();

  const checkAndRegisterProduct = useCallback(async () => {
    try {
      await registerProductAndFetch(warrantyId);
      if (!warrantyData) return;

      const { period, duration } = warrantyData.moduleInfo;
      const purchaseDate = Date.now();
      const expirationDate = dayjs()
        .add(period, duration?.value?.toLowerCase() as ManipulateType)
        .valueOf();

      const modules =
        productDetails?.modules?.map((module: any) => {
          if (module.id === warrantyId) {
            return {
              ...module,
              moduleInfo: {
                ...module.moduleInfo,
                purchaseDate,
                expirationDate,
                activated: true,
              },
            };
          }
          return module;
        }) || [];

      setRegisteringProduct(false);
      setProductRegistered(true);
      setProductDetails({
        ...productDetails,
        product: { ...productDetails?.product, registeredToCurrentUser: true },
        modules,
      });

      setMeta({
        title:
          registrationData?.confirmationHeader ||
          registrationTranslation(
            getSuccessTitle(registrationData?.registrationType)
          ),
        description: registrationData?.confirmationText,
      });

      showSuccess();
    } catch (error: any) {
      console.log(error);
      const errorResponse: any = await error.json();
      showToast({ message: errorResponse.error, type: 'error' });
      closePage();
    }
  }, [
    registerProductAndFetch,
    registrationData,
    warrantyId,
    warrantyData,
    closePage,
    productDetails,
    setProductDetails,
  ]);

  // register or activate the warranty
  const register = useCallback(() => {
    if (productRegisterCallMade) return;

    openDrawer();
    setProductRegisterCallMade(true);

    if (isPreviewMode) {
      openDrawer();
    } else {
      checkAndRegisterProduct();
    }
  }, [checkAndRegisterProduct, isPreviewMode, productRegisterCallMade]);

  useEffect(() => {
    if (isNewUser) {
      if (product.registeredToCurrentUser || productRegistered)
        setPageToShow(PageType.PERSONAL_DETAILS_FORM);
      else setPageToShow(PageType.NONE);
      return;
    }

    if (
      !currentModule?.registrationRequired ||
      product.registeredToCurrentUser
    ) {
      setPageToShow(PageType.CURRENT_MODULE);
      return;
    }

    if (alreadySignedIn) {
      setPageToShow(PageType.PRE_REGISTER);
      return;
    }
  }, [
    isNewUser,
    product,
    alreadySignedIn,
    register,
    currentModule,
    productRegistered,
  ]);

  useEffect(() => {
    // only update disableModal when user is loggedIn
    if (user && currentModule?.registrationRequired) {
      setDisableModalDismiss(open);
    }
  }, [open, currentModule, setDisableModalDismiss, user]);

  useEffect(() => {
    try {
      if (open && isPreviewMode) {
        setTimeout(() => {
          window.parent.postMessage({ type: 'userRegistered' }, '*');
        }, 3000);
      }
    } catch (e) {}
  }, [open, isPreviewMode]);

  const renderPage = useCallback(() => {
    switch (pageToShow) {
      case PageType.NONE:
        return null;
      case PageType.CURRENT_MODULE:
        return children;
      case PageType.PERSONAL_DETAILS_FORM:
        return (
          <PersonalDetails
            saveToShopify={true}
            onPersonalDetailsUpdate={() => {
              setPageToShow(PageType.CURRENT_MODULE);
              onUserUpdate();
            }}
          />
        );
      case PageType.PRE_REGISTER:
        return (
          <Wrapper
            width='100%'
            direction='column'
            justifyContent='flex-start'
            alignItems='center'
            gap='1.2rem'
            overflow='auto'
            margin='3.75rem 0 0 0'
          >
            {html && (
              <HtmlWrapper
                width='100%'
                padding='0 1rem'
                direction='column'
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
            <Wrapper
              padding='0 1rem'
              style={{ borderTop: '2px solid #E7EAEB' }}
            >
              <Text
                margin='1rem 0 0 0'
                fontSize='0.625rem'
                textAlign='left'
                color='#414149'
              >
                <p>
                  {t('termsAndconditions.part1')}
                  {brandName}
                  {t('termsAndconditions.part2')}
                  {showMulberryTerms
                    ? t('termsAndconditions.mulberryAndBrijBrand')
                    : t('termsAndconditions.brijBrand')}
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href={t('termsAndconditions.link')}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {t('termsAndconditions.linkText')}
                  </a>
                  {'.'}
                  {t('termsAndconditions.part3')}
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href={`mailto:help@brij.it?subject=Help with ${brandName} ${product.name} (${slug})`}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {t('termsAndconditions.helpEmail')}
                  </a>
                  {'.'}
                </p>
              </Text>
            </Wrapper>
            <Button
              variant='dark'
              brandTheme={brandTheme}
              onClick={() => {
                openDrawer();
                register();
              }}
            >
              {getRegisterText(registrationData?.registrationType)}
            </Button>
          </Wrapper>
        );
    }
  }, [
    t,
    onUserUpdate,
    register,
    registrationData,
    brandName,
    brandTheme,
    children,
    html,
    pageToShow,
    showMulberryTerms,
    product.name,
    slug,
  ]);

  return renderPage();
};

export default RegistrationDrawer;
