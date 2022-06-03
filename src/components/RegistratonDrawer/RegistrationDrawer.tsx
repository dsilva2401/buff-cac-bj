import React, { useCallback, useEffect, useState } from 'react';
import { getRegisterText, RegistrationType } from 'utils/getRegisterText';
import { ModuleInfoType, Product } from '../../types/ProductDetailsType';
import { useGlobal } from '../../context/global/GlobalContext';
import { showToast } from 'components/Toast/Toast';
import { useTranslation } from 'react-i18next';
import SuccessDrawer from 'components/SuccessDrawer';
import PersonalDetails from 'components/PersonalDetails';
import LoadingIndicator from 'components/LoadingIndicator';
import HtmlWrapper from 'components/HtmlWrapper';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Text from 'components/Text';
import { useAPI } from 'utils/api';

enum PageType {
  CURRENT_MODULE = 'CURRENT_MODULE',
  PERSONAL_DETAILS_FORM = 'PERSONAL_DETAILS_FORM',
  PRE_REGISTER = 'PRE_REGISTER',
}

type RegistrationDrawerProps = {
  closePage(): void;
  warrantyId: string;
  warrantyData?: ModuleInfoType;
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

const getSuccessTitle = (
  registrationType: string = RegistrationType.REGISTER
): string => {
  switch (registrationType) {
    case RegistrationType.REGISTER:
      return 'Product Registered!';
    case RegistrationType.SIGNUP:
      return "You're Signed Up";
    case RegistrationType.ACTIVATE:
      return 'Warranty Activated!';
  }

  return 'Product Registered!';
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
  const [successDrawer, setSuccessDrawer] = useState<boolean>(false);
  const [pageToShow, setPageToShow] = useState<PageType>(
    PageType.CURRENT_MODULE
  );
  // temprarory loading to handle initial loading while checking if product can be registered
  const [tempLoading, setTempLoading] = useState<boolean>(true);
  const [productRegisterCallMade, setProductRegisterCallMade] =
    useState<boolean>(false);

  const {
    loading,
    user,
    token,
    reFetchProduct,
    brandTheme,
    slug,
    isPreviewMode,
  } = useGlobal();
  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.warrantyDrawer',
  });

  const { t: registrationTranslation } = useTranslation('translation', {
    keyPrefix: 'drawers.registrationDrawer',
  });

  const { t: authDrawerTranslation } = useTranslation('translation', {
    keyPrefix: 'drawers.authDrawer',
  });

  const onRegisterProductSuccess = useCallback(() => {
    reFetchProduct();
  }, [reFetchProduct]);

  const onRegisterProductError = useCallback((error) => {
    console.log(error);
  }, []);

  const [registerProduct] = useAPI(
    {
      method: 'POST',
      endpoint: `products/register/${slug}`,
      onSuccess: onRegisterProductSuccess,
      onError: onRegisterProductError,
    },
    token
  );

  const closeSuccess = useCallback(() => {
    setSuccessDrawer(false);
    closePage();
  }, [closePage]);

  const checkAndRegisterProduct = useCallback(async () => {
    registerProduct({
      warrantyId,
    })
      .then(() => {
        setSuccessDrawer(true);
      })
      .catch(async (error: any) => {
        const errorResponse: any = await error.json();
        showToast({ message: errorResponse.error, type: 'error' });
        closePage();
      })
      .finally(() => setTempLoading(false));
  }, [registerProduct, warrantyId, closePage]);

  // register or activate the warranty
  const register = useCallback(() => {
    setTempLoading(true);
    if (isPreviewMode) {
      setSuccessDrawer(true);
      setTimeout(() => {
        setTempLoading(false);
      }, 200);
    } else {
      checkAndRegisterProduct();
    }
  }, [checkAndRegisterProduct, isPreviewMode]);

  // call register if
  // registration is Required in order to view the module
  // if the product is not registered to the user
  // if user just signedin
  useEffect(() => {
    if (isPreviewMode) {
      setTempLoading(false);
    }

    if (
      !currentModule ||
      (currentModule.registrationRequired && !token) ||
      productRegisterCallMade
    ) {
      return;
    }

    if (product.registeredToCurrentUser === undefined) {
      if (!currentModule.registrationRequired) {
        setTempLoading(false);
      }
      return;
    }

    if (
      currentModule.registrationRequired &&
      !alreadySignedIn &&
      !product.registeredToCurrentUser
    ) {
      register();
      setProductRegisterCallMade(true);
    } else {
      setTempLoading(false);
    }
  }, [currentModule, product, register, alreadySignedIn, token]);

  useEffect(() => {
    // if a new user start registering the product
    // set the page to personal details form
    // user will see this once registration is over
    if (isNewUser) {
      setPageToShow(PageType.PERSONAL_DETAILS_FORM);
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
  }, [isNewUser, product, alreadySignedIn, register, currentModule]);

  useEffect(() => {
    // only update disableModal when user is loggedIn
    if (user && currentModule?.registrationRequired) {
      setDisableModalDismiss(successDrawer);
    }
  }, [successDrawer, currentModule, setDisableModalDismiss, user]);

  useEffect(() => {
    // close success animation after 3 seconds
    if (successDrawer) {
      setTimeout(() => {
        setSuccessDrawer(false);
      }, 3000);
    }
  }, [successDrawer]);

  useEffect(() => {
    try {
      if (successDrawer && isPreviewMode) {
        setTimeout(() => {
          window.parent.postMessage({ type: 'userRegistered' }, '*');
        }, 3000);
      }
    } catch (e) {}
  }, [successDrawer, isPreviewMode]);

  const translationToUse = warrantyData ? t : registrationTranslation;

  const renderPage = useCallback(() => {
    switch (pageToShow) {
      case PageType.CURRENT_MODULE:
        return children;
      case PageType.PERSONAL_DETAILS_FORM:
        return (
          <PersonalDetails
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
                  {authDrawerTranslation('termsAndconditions.part1')}
                  {brandName}
                  {authDrawerTranslation('termsAndconditions.part2')}
                  {showMulberryTerms
                    ? authDrawerTranslation(
                        'termsAndconditions.mulberryAndBrijBrand'
                      )
                    : authDrawerTranslation('termsAndconditions.brijBrand')}
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href='https://brij.it/terms'
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {authDrawerTranslation('termsAndconditions.link')}
                  </a>
                </p>
              </Text>
            </Wrapper>
            <Button variant='dark' brandTheme={brandTheme} onClick={register}>
              {getRegisterText(registrationData?.registrationType)}
            </Button>
          </Wrapper>
        );
    }
  }, [
    onUserUpdate,
    register,
    registrationData,
    authDrawerTranslation,
    brandName,
    brandTheme,
    children,
    html,
    pageToShow,
    showMulberryTerms,
  ]);

  return (
    <>
      {
        // we need to show the loadingIndicator for both loading & tempLoading to avoid rendering PersonalDetails at the initial render
        loading || tempLoading ? (
          <Wrapper
            justifyContent='center'
            alignItems='center'
            height='100%'
            width='100%'
          >
            <LoadingIndicator />
          </Wrapper>
        ) : (
          renderPage()
        )
      }
      <SuccessDrawer
        isOpen={successDrawer}
        title={
          registrationData?.confirmationHeader ||
          getSuccessTitle(registrationData?.registrationType)
        }
        description={
          registrationData?.confirmationText ||
          translationToUse('successDrawer.description')
        }
        close={closeSuccess}
      />
    </>
  );
};

export default RegistrationDrawer;
