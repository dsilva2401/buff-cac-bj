import React, { useCallback, useEffect, useState } from 'react';
import { getRegisterText, RegistrationType } from 'utils/getRegisterText';
import {
  ModuleInfoType,
  Product,
  WarrantyModuleType,
} from '../../types/ProductDetailsType';
import { useAPI } from 'utils/api';
import { useGlobal } from '../../context/global/GlobalContext';
import { showToast } from 'components/Toast/Toast';
import { useTranslation } from 'react-i18next';
import dayjs, { ManipulateType } from 'dayjs';
import PersonalDetails from 'components/PersonalDetails';
import SuccessDrawer from 'components/SuccessDrawer';
import HtmlWrapper from 'components/HtmlWrapper';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Text from 'components/Text';

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

const useRegisterProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { slug, reFetchProduct, token } = useGlobal();

  const [registerProduct] = useAPI(
    {
      method: 'POST',
      endpoint: `products/register/${slug}`,
    },
    token
  );

  const registerProductAndFetch = useCallback(
    async (warrantyId: string) => {
      setLoading(true);

      try {
        await registerProduct({ warrantyId });
        reFetchProduct();
        return;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [registerProduct]
  );

  return { registerProductAndFetch, loading };
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
  const [productRegistered, setProductRegistered] = useState<boolean>(false);
  const [waitingForToken, setWaitingForToken] = useState<boolean>(false);
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
  } = useGlobal();

  const { t: authDrawerTranslation } = useTranslation('translation', {
    keyPrefix: 'drawers.authDrawer',
  });

  const closeSuccess = useCallback(() => {
    setSuccessDrawer(false);
    closePage();
  }, [closePage]);

  const { registerProductAndFetch, loading: registerProductLoading } =
    useRegisterProduct();

  const checkAndRegisterProduct = useCallback(async () => {
    try {
      await registerProductAndFetch(warrantyId);

      if (!warrantyData) {
        return;
      }

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

      setProductDetails({
        ...productDetails,
        product: { ...productDetails?.product, registeredToCurrentUser: true },
        modules,
      });

      setProductRegistered(true);
    } catch (error: any) {
      const errorResponse: any = await error.json();
      showToast({ message: errorResponse.error, type: 'error' });
      closePage();
    }
  }, [
    registerProductAndFetch,
    warrantyId,
    warrantyData,
    closePage,
    productDetails,
    setProductDetails,
    isNewUser,
  ]);

  // register or activate the warranty
  const register = useCallback(() => {
    if (productRegisterCallMade) {
      return;
    }

    setSuccessDrawer(true);
    setProductRegisterCallMade(true);
    if (isPreviewMode) {
      setSuccessDrawer(true);
    } else {
      checkAndRegisterProduct();
    }
  }, [checkAndRegisterProduct, isPreviewMode, productRegisterCallMade]);

  useEffect(() => {
    // if it's a new user call register
    if (isNewUser && !productRegisterCallMade) {
      setWaitingForToken(true);
      setSuccessDrawer(true);

      if (token) {
        register();
        setWaitingForToken(false);
      }
    }
  }, [isNewUser, register, token, productRegisterCallMade]);

  // call register if
  // registration is Required in order to view the module
  // if the product is not registered to the user
  // if user just signedin
  useEffect(() => {
    if (!currentModule || (currentModule.registrationRequired && !token)) {
      return;
    }

    if (product.registeredToCurrentUser === undefined) {
      return;
    }

    if (
      currentModule.registrationRequired &&
      !alreadySignedIn &&
      !product.registeredToCurrentUser
    ) {
      register();
    }
  }, [currentModule, product, register, alreadySignedIn, token, isNewUser]);

  useEffect(() => {
    if (isNewUser) {
      if (product.registeredToCurrentUser || productRegistered) {
        setPageToShow(PageType.PERSONAL_DETAILS_FORM);
      } else {
        setPageToShow(PageType.NONE);
      }
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
      setDisableModalDismiss(successDrawer);
    }
  }, [successDrawer, currentModule, setDisableModalDismiss, user]);

  useEffect(() => {
    try {
      if (successDrawer && isPreviewMode) {
        setTimeout(() => {
          window.parent.postMessage({ type: 'userRegistered' }, '*');
        }, 3000);
      }
    } catch (e) {}
  }, [successDrawer, isPreviewMode]);

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
                  {'.'}
                  {authDrawerTranslation('termsAndconditions.part3')}
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href={`mailto:help@brij.it?subject=Help with ${brandName} ${product.name} (${slug})`}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {authDrawerTranslation('termsAndconditions.helpEmail')}
                  </a>
                  {'.'}
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
      <SuccessDrawer
        isOpen={successDrawer}
        loading={waitingForToken || registerProductLoading}
        onCompleteAnimation={() => setSuccessDrawer(false)}
        title={
          registrationData?.confirmationHeader ||
          getSuccessTitle(registrationData?.registrationType)
        }
        description={registrationData?.confirmationText}
        close={closeSuccess}
      />
      {renderPage()}
    </>
  );
};

export default RegistrationDrawer;
