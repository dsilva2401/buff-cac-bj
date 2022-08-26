import React, {
  useCallback,
  Suspense,
  useEffect,
  useMemo,
  useState,
  lazy,
} from 'react';
import { ReactComponent as Arrow } from 'assets/icons/svg/arrow-small.svg';
import { ReactComponent as MulberryLogo } from 'assets/logos/svg/mulberry-logo.svg';
import { ReactComponent as ExternalLink } from 'assets/icons/svg/external-link.svg';
import { ButtonType } from 'components/BottomDrawer/BottomDrawer';
import { useGlobal } from '../../context/global/GlobalContext';
import { MAGIC_ACTION } from 'context/global/GlobalProvider';
import { useHistory, useLocation } from 'react-router-dom';
import { FormDetailModel } from 'types/FormTypes';
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
import useElementSize from 'hooks/useElementSize';
import useHeights from 'hooks/useHeights';
import Wrapper from 'components/Wrapper';
import ProductHeroImage from './ProductHeroImage';
import LoadingIndicator from 'components/LoadingIndicator';
import RegistratonDrawer from 'components/RegistratonDrawer';
import {
  CustomModuleType,
  DocumentModuleType,
  LinkModuleType,
  ModuleInfoType,
  ProductDetailsType,
  ReferralModuleType,
  ShoppingModuleType,
  VideoModuleType,
  WarrantyModuleType,
} from '../../types/ProductDetailsType';
import { useSuccessDrawerContext } from 'context/SuccessDrawerContext/SuccessDrawerContext';
import useRegisterProduct from 'hooks/useRegisterProduct';
import addWarrantyInformation from 'utils/addWarrantyInformation';
import getSuccessTitle from 'utils/getSuccessTitle';
import { useAPICacheContext } from 'context/APICacheContext/APICacheContext';
import { showToast } from 'components/Toast/Toast';
import { useAPI } from 'utils/api';
import CatchLinkWrapper from 'components/CatchLinkWrapper';
import { FormProvider } from 'context';
const ShopDrawer = lazy(() => import('../../components/ShopDrawer'));
const VideoDrawer = lazy(() => import('../../components/VideoDrawer'));
const CustomDrawer = lazy(() => import('../../components/CustomDrawer'));
const ReferralDrawer = lazy(() => import('../../components/ReferralDrawer'));
const WarrantyDrawer = lazy(() => import('../../components/WarrantyDrawer'));
const DocumentDrawer = lazy(() => import('../../components/DocumentDrawer'));
const FormDrawer = lazy(() => import('../../components/FormDrawer'));

type UrlParam = {
  id: string;
};

const getWarrantyModule = (details: ProductDetailsType) => {
  return details?.modules?.find(
    (module: ModuleInfoType) => module?.type === 'WARRANTY_MODULE'
  );
};
interface Props {
  navToForm?: boolean;
}

const ProductDetails: React.FC<Props> = ({ navToForm }) => {
  const [registerCallMade, setRegisterCallMade] = useState<boolean>(false);
  const [isDrawerPageOpen, setIsDrawerPageOpen] = useState<boolean>(false);
  const [isFormNavigation, setIsFormNavigation] = useState(false);
  const [animateTable, toggleAnimateTable] = useState<boolean>(false);
  const [showCoverageTable, toggleCoverageTable] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string | undefined>('');
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [mainDrawerOpen, setMainDrawerOpen] = useState<boolean>(false);
  const [isNewUser, setNewUser] = useState<boolean>(false);
  const { topHeight, bottomHeight } = useHeights();
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
    setSignInRedirect,
    setIsMenuOpen,
    setSlug,
    previewEvent,
    isPreviewMode,
    previewAuthenticated,
    setPreviewAuthenticated,
    logEvent,
    retractDrawer,
    setMagicAction,
    setMagicPayload,
    productModule,
    agegateDisplay,
    toggleAgegateDisplay,
    brandTheme,
    loading,
    setProductModule,
    alreadySignedIn,
    setAlreadySignIn,
    redirectResolved,
    registeringProduct,
    setRegisteringProduct,
    token,
    setProductDetails,
    personalDetails,
    reFetchProduct,
    authFetched,
    formRegistration,
    setFormRegistration,
  } = useGlobal();

  const { t: registrationTranslation } = useTranslation('translation', {
    keyPrefix: 'registration',
  });

  const { t: formTranslation } = useTranslation('translation', {
    keyPrefix: 'drawers.formDrawer',
  });

  const { id } = useParams<UrlParam>();
  const [tableRef, { height }] = useElementSize();
  const { registerProductAndFetch } = useRegisterProduct();
  const {
    setMeta,
    showSuccess,
    closeDrawer: closeSuccessDrawer,
    openDrawer,
    open,
  } = useSuccessDrawerContext();
  const { invalidateCache } = useAPICacheContext();
  const onError = () => {
    showToast({
      type: 'error',
      message: formTranslation('regFormFetchError'),
    });
  };

  useEffect(() => {
    if (
      details &&
      details.registration &&
      details.registration.isSubmissionRequired
    ) {
      getRegistrationForm();
    }
  }, [details]);

  const [getRegistrationForm] = useAPI<{ id: string }>(
    {
      method: 'GET',
      endpoint: `form/${details?.registration.formModuleId}`,
      onSuccess: (form) => {
        setFormRegistration(form);
      },
      onError: onError,
    },
    null,
    true
  );

  const onLinkClick = (href: string) => {
    logEvent({
      eventType: 'ENGAGEMENTS',
      event: 'WEBSITE_VISITS',
      data: {
        ...details?.brand,
        url: href,
      },
    });
  };

  const closeDrawerPage = useCallback(
    (closeDrawer = false, registrationFormCallback = false) => {
      setCurrentPage(null);
      setNewUser(false);
      toggleAnimateTable(false);
      setIsDrawerPageOpen(false);
      if (registrationFormCallback) {
        setIsFormNavigation(false);
        history.replace(`/c/${id}`);
        return;
      }
      if (isFormNavigation && closeDrawer) {
        setIsFormNavigation(false);
        setTimeout(() => {
          history.push(`/c/${id}`);
        }, 0);
      }
    },
    [isFormNavigation, history, id]
  );

  useEffect(() => {
    if (navToForm) {
      setIsFormNavigation(navToForm);
    }
  }, [navToForm]);

  useEffect(() => {
    // for enabling back button to correct path and form module.
    if (location.pathname === `/c/${id}`) closeDrawerPage();
  }, [location.pathname, closeDrawerPage, id]);

  const changeDrawerPage = useCallback(
    (index) => {
      setCurrentPage(index);
      // refactor this to be controlled from module config
      const newModule = details?.modules[index];
      setMagicAction(MAGIC_ACTION.OPEN_MODULE);
      setMagicPayload({ moduleId: newModule?.id });

      if (index) {
        const moduleType = details?.modules[index]?.type;
        setIsDrawerPageOpen(moduleType !== 'LINK_MODULE');
        if (moduleType !== 'LINK_MODULE')
          setPageTitle(details?.modules[index].title);
      } else {
        setIsDrawerPageOpen(true);
        setPageTitle(details?.modules[index].title);
      }
    },
    [details, setMagicPayload, setMagicAction]
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
  }, [isDrawerPageOpen, details, currentPage]);

  useEffect(() => {
    const event = previewEvent;
    if (event && event.type === 'changeDrawerPage') {
      changeDrawerPage(event.data);
    } else if (event && event.type === 'closeDrawerPage') {
      closeDrawerPage();
    } else if (event && event.type === 'openMenu') {
      setMainDrawerOpen(true);
    } else if (event && event.type === 'closeMenu') {
      closeDrawerPage();
      setMainDrawerOpen(false);
    }
  }, [previewEvent, changeDrawerPage, closeDrawerPage, details?.modules]);

  // automatically open module upon redirect
  useEffect(() => {
    if (isFormNavigation && details?.modules?.length) {
      //find
      const moduleIndex = details?.modules.findIndex(
        (module) => module.type === 'FORMS_MODULE'
      );
      let brijFormRegistrationIndex = localStorage.getItem(
        'brij-form-registration'
      );
      if (moduleIndex >= 0) {
        setMagicAction(MAGIC_ACTION.OPEN_MODULE);
        changeDrawerPage(
          brijFormRegistrationIndex !== null
            ? brijFormRegistrationIndex
            : moduleIndex
        );
        setPosition({ x: 0, y: topHeight });
        setMainDrawerOpen(true);
      }
    }
  }, [isFormNavigation, details, topHeight, changeDrawerPage, setMagicAction]);

  useEffect(() => {
    if (registerCallMade) {
      return;
    }

    if (!token) {
      return;
    }

    if (!registeringProduct) {
      return;
    }

    if (!personalDetails) {
      return;
    }

    const register = async () => {
      try {
        if (!details) {
          return;
        }

        openDrawer();

        setRegisterCallMade(true);

        const isItemExist = personalDetails?.profile?.productCollection?.find(
          (item) => item.tagId === id
        );

        if (isItemExist) {
          invalidateCache();
          await reFetchProduct();

          const moduleIndex = details?.modules?.findIndex(
            (moduleDetail) => moduleDetail.id === productModule
          );

          if (moduleIndex !== -1) {
            changeDrawerPage(moduleIndex);
            setPosition({ x: 0, y: topHeight });
            setMainDrawerOpen(true);
          }

          // HACK: To hide the animation of opening the bottomdrawer
          setTimeout(() => closeSuccessDrawer(), 1000);
          return;
        }

        const warrantyModule = getWarrantyModule(details);
        await registerProductAndFetch(warrantyModule?.id as string);

        const registrationData = details?.registration;

        setMeta({
          title:
            registrationData?.confirmationHeader ||
            registrationTranslation(
              getSuccessTitle(registrationData?.registrationType)
            ),
          description: registrationData?.confirmationText,
        });

        if (warrantyModule) {
          const productDetailsWithWarranty = addWarrantyInformation(
            warrantyModule,
            details
          );

          setProductDetails(productDetailsWithWarranty);
        }

        showSuccess();

        const moduleIndex = details?.modules?.findIndex(
          (moduleDetail) => moduleDetail.id === productModule
        );

        if (moduleIndex !== -1) {
          changeDrawerPage(moduleIndex);
          setPosition({ x: 0, y: topHeight });
          setMainDrawerOpen(true);
        }
      } catch (error: any) {
        closeSuccessDrawer();
        showToast({ message: error, type: 'error' });
      } finally {
        setRegisteringProduct(false);
      }
    };

    if (details?.modules?.length) {
      register();
    }
  }, [
    productModule,
    details,
    registeringProduct,
    registerCallMade,
    changeDrawerPage,
    topHeight,
    personalDetails,
    id,
    reFetchProduct,
    invalidateCache,
    token,
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
        if (details?.modules[x]?.registrationRequired) {
          setSignInRedirect(`/c/${id}`);
        }
      }
    }
  }, [details, setSignInRedirect, id]);

  const warrantyDrawerTitle = useMemo(() => {
    let title: string = '';
    if (details && currentPage !== null) {
      const moduleInfo = details.modules[currentPage]
        .moduleInfo as WarrantyModuleType;
      title = moduleInfo?.activated
        ? t('viewWarranty')
        : details?.modules[currentPage].title;
    }
    return title;
  }, [t, details, currentPage]);

  let buttonsArray = useCallback(() => {
    let buttons: ButtonType[] = [];
    if (details) {
      for (let x = 0; x < details?.modules?.length; x++) {
        let title: string = details.modules[x].title;
        let moduleType: string = details.modules[x].type;
        let moduleData: VideoModuleType | LinkModuleType | null = null;
        switch (details.modules[x].type) {
          case 'WARRANTY_MODULE':
            const moduleInfo = details.modules[x]
              .moduleInfo as WarrantyModuleType;
            title = moduleInfo?.activated
              ? t('viewWarranty')
              : details.modules[x].title;
            break;
          case 'VIDEO_MODULE':
            moduleData = details.modules[x].moduleInfo as VideoModuleType;
            break;
          default:
            title = details.modules[x].title;
            break;
        }
        let buttonObject: ButtonType = {
          title,
          onClick: () => {
            const module = details?.modules[x];
            setProductModule(module.id);
            if (details?.modules[x]?.type === 'LINK_MODULE') {
              let moduleData = module?.moduleInfo as LinkModuleType;
              const link =
                moduleData?.link.includes('https://') ||
                moduleData?.link.includes('http://')
                  ? moduleData?.link
                  : `https://${moduleData?.link}`;

              window.open(link, '_blank');
              onLinkClick(link);
            } else if (details?.modules[x]?.type === 'DOCUMENT_MODULE') {
              let moduleData = module?.moduleInfo as DocumentModuleType;
              !details?.modules[x].registrationRequired
                ? window.open(
                    moduleData.path,
                    isPreviewMode ? '_blank' : '_self'
                  )
                : changeDrawerPage(x);
            } else changeDrawerPage(x);
            logEvent({
              eventType: 'ENGAGEMENTS',
              event: 'MODULE_CLICKED',
              moduleType: module.type,
              moduleId: module.id,
            });
            let isFormRegCompelte = localStorage.getItem(
              'brij-form-registration-complete'
            );
            if (
              details?.registration.isSubmissionRequired &&
              module.registrationRequired &&
              !isFormRegCompelte
            ) {
              localStorage.setItem('brij-form-registration', '' + x);
            } else {
              localStorage.removeItem('brij-form-registration');
            }
          },
          isHighlight: x === 0,
          moduleType: moduleType,
          moduleData: moduleData?.path,
          registrationRequired: details?.modules[x].registrationRequired,
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
  }, [t, details, changeDrawerPage, logEvent, brandTheme, setProductModule]);

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
            <Text fontSize='1rem' fontWeight='600' wrapperWidth='max-content'>
              <span>{`$${price}`}</span>
            </Text>
          );
        }

        return (
          <Wrapper direction='column' alignItems='flex-end'>
            <Text
              textDecoration='line-through'
              wrapperWidth='max-content'
              fontSize='0.8rem'
              color='grey'
            >
              <span>{`$${price}`}</span>
            </Text>
            <Text fontSize='1rem' fontWeight='600' wrapperWidth='max-content'>
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
              <span>{`${duration?.label !== 'Lifetime' ? period : ''} ${
                duration?.label
              }`}</span>
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
      setDisableModalDismiss(false);
    },
    [isPreviewMode, setPreviewAuthenticated]
  );

  useEffect(() => {
    const brijFormRegistration = localStorage.getItem('brij-form-registration');
    const brijFormReturnModule = parseInt(brijFormRegistration as string, 10);
    if (brijFormRegistration) {
      setCurrentPage(brijFormReturnModule);
    }
  }, []);

  const renderDrawerPage = useCallback(() => {
    // have a useEffect see if the form value is present on refresh.
    const brijFormRegistration = localStorage.getItem('brij-form-registration');
    const brijFormReturnModule = parseInt(brijFormRegistration as string, 10);
    const isRegistrationFormComplete = localStorage.getItem(
      'brij-form-registration-complete'
    );

    // if brij form is there and no formRegistration wait till we get it.
    if (brijFormRegistration && !formRegistration) {
      return;
    }

    if (details) {
      const module = details?.modules[currentPage as number];
      let moduleType: string | undefined = module?.type;
      let moduleTitle: string | undefined = module?.title;
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

      // remove the brijFormRegistraion.
      if (
        module?.registrationRequired &&
        formRegistration &&
        currentPage !== null &&
        !isRegistrationFormComplete
      ) {
        if (brijFormRegistration && formRegistration) {
          return (
            <Suspense fallback={<LoadingIndicator />}>
              <FormProvider>
                <Wrapper height='100%'>
                  <FormDrawer
                    formModuleData={formRegistration as ModuleInfoType}
                    data={formRegistration?.moduleInfo as FormDetailModel[]}
                    endScreenNavModuleIndex={
                      isNaN(brijFormReturnModule)
                        ? currentPage ?? 0
                        : brijFormReturnModule
                    }
                    closeDrawer={closeDrawerPage}
                    changeDrawerPage={changeDrawerPage}
                  />
                </Wrapper>
              </FormProvider>
            </Suspense>
          );
        }
        return;
      }

      if (brijFormRegistration) {
        localStorage.removeItem('brij-form-registration');
      }

      if (module?.registrationRequired && !token) {
        return (
          <Wrapper
            width='100%'
            direction='column'
            transition='0.3s'
            margin='4rem 0 0 0'
            height={
              showCoverageTable ? '100%' : `calc(100% - ${height - 100}px)`
            }
          >
            {mulberry ? (
              <Wrapper
                gap='1rem'
                width='100%'
                direction='column'
                alignItems='center'
                padding='0 0.75rem'
                justifyContent='flex-start'
                transition={animateTable ? '0.3s' : '0'}
              >
                <Wrapper
                  width='100%'
                  left='0'
                  top='0'
                  zIndex={1}
                  minHeight='4rem'
                  position='fixed'
                  borderRadius='26px'
                  background='#FFFFFF'
                >
                  <MulberryLogo
                    width='7.2rem'
                    style={{ margin: '1.25rem 4rem 1.25rem 1.75rem' }}
                  />
                </Wrapper>
                <Animated
                  animationIn='slideInRight'
                  animationOut='slideOutLeft'
                  animationInDuration={retractDrawer ? 0 : 200}
                  animationOutDuration={retractDrawer ? 0 : 200}
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
                      textAlign='center'
                      wrapperWidth='max-content'
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
                    <Wrapper padding='1px 0 0 0' margin='auto'>
                      <Wrapper
                        ref={tableRef}
                        height='100%'
                        gap='0.5rem'
                        transition='0.3s'
                        padding='2rem 0 0 0'
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
                          <ExternalLink
                            fill={brandTheme || theme.primary}
                            style={{ margin: '-0.05rem 0.25rem 0 0' }}
                          />
                          <Text
                            fontSize='0.75rem'
                            fontWeight='500'
                            color={brandTheme || theme.primary}
                          >
                            <p>{t('fullTermsLink')}</p>
                          </Text>
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                  </Wrapper>
                </Animated>
              </Wrapper>
            ) : (
              <Wrapper
                width='100%'
                height='max-content'
                left='0'
                top='-1px'
                zIndex={1}
                minHeight='4rem'
                position='fixed'
                borderRadius='26px'
                background='#FFFFFF'
              >
                <Text
                  fontSize='1rem'
                  fontWeight='600'
                  margin='1.25rem 4rem 1.25rem 1.75rem'
                >
                  <h1>{moduleTitle}</h1>
                </Text>
              </Wrapper>
            )}
            <Wrapper
              width='100%'
              height='100%'
              direction='column'
              transition={animateTable ? '0.3s' : '0'}
              style={{
                transform: !showCoverageTable
                  ? `translateY(-${height}px)`
                  : 'translateY(0)',
              }}
            >
              <AuthDrawer
                brandName={details?.brand?.name}
                productName={details?.product?.name}
                html={mulberry ? null : details?.registration?.registrationText}
                animated={!!mulberry}
                showMulberryTerms={!!mulberry}
                onAuthComplete={onAuthComplete}
                hideSignupOptions={details?.registration?.hideSignupOptions}
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
          case 'DOCUMENT_MODULE':
            return (
              <Suspense fallback={<LoadingIndicator />}>
                <DocumentDrawer
                  drawerTitle={details?.modules[currentPage as number]?.title}
                  drawerData={module?.moduleInfo as DocumentModuleType}
                  registrationRequired={
                    details?.modules[currentPage as number]
                      ?.registrationRequired
                  }
                  closeDrawer={closeDrawerPage}
                  isPreviewMode={isPreviewMode}
                />
              </Suspense>
            );
          case 'CUSTOM_MODULE':
            return (
              <Suspense fallback={<LoadingIndicator />}>
                <CustomDrawer
                  drawerTitle={details?.modules[currentPage as number]?.title}
                  drawerData={module?.moduleInfo as CustomModuleType}
                />
              </Suspense>
            );
          case 'WARRANTY_MODULE':
            return (
              <Suspense fallback={<LoadingIndicator />}>
                <WarrantyDrawer
                  drawerTitle={warrantyDrawerTitle}
                  warrantyData={module?.moduleInfo as WarrantyModuleType}
                  warrantyId={module?.id}
                />
              </Suspense>
            );
          case 'REFERRAL_MODULE':
            return (
              <Suspense fallback={<LoadingIndicator />}>
                <ReferralDrawer
                  drawerTitle={details?.modules[currentPage as number]?.title}
                  referralData={module?.moduleInfo as ReferralModuleType}
                />
              </Suspense>
            );
          case 'SHOPPING_MODULE':
            const data = details?.modules[currentPage as number]
              ?.moduleInfo as ShoppingModuleType;
            return (
              <Suspense fallback={<LoadingIndicator />}>
                <ShopDrawer
                  data={data}
                  minimizeBranding={details.brand.minimizeBranding}
                  productDescription={details.product.productDescription}
                  brand={details?.brand}
                />
              </Suspense>
            );
          case 'VIDEO_MODULE':
            return (
              <Suspense fallback={<LoadingIndicator />}>
                <VideoDrawer closeDrawer={closeDrawerPage} />
              </Suspense>
            );
          case 'FORMS_MODULE':
            const dataForm = details?.modules[currentPage as number]
              ?.moduleInfo as FormDetailModel[];
            return (
              <FormProvider>
                <Wrapper height='100%'>
                  <Suspense fallback={<LoadingIndicator />}>
                    <FormDrawer
                      formModuleData={details.modules[currentPage as number]}
                      data={dataForm}
                      closeDrawer={closeDrawerPage}
                      changeDrawerPage={changeDrawerPage}
                    />
                  </Suspense>
                </Wrapper>
              </FormProvider>
            );
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
          {renderOtherModules()}
        </RegistratonDrawer>
      );
    }
  }, [
    t,
    currentPage,
    animateTable,
    isNewUser,
    retractDrawer,
    closeDrawerPage,
    details,
    previewAuthenticated,
    isPreviewMode,
    toggleAnimateTable,
    showCoverageTable,
    height,
    tableRef,
    brandTheme,
    onAuthComplete,
    alreadySignedIn,
    setAlreadySignIn,
    warrantyDrawerTitle,
    formRegistration,
    setFormRegistration,
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

  const pageLoading =
    loading ||
    !redirectResolved ||
    !authFetched ||
    (registeringProduct && !open);

  return (
    <>
      {details && <AgeGate />}
      {details && (
        <Helmet>
          <title>{`${details?.brand?.name} by Brij`}</title>
        </Helmet>
      )}
      <ProductHeroImage />
      <Wrapper
        width='100%'
        height='100%'
        direction='column'
        justifyContent='space-between'
        overflow='auto'
        position='relative'
      >
        {pageLoading ? (
          <LoadingIndicator />
        ) : (
          <PageHeader
            logo={logo(details?.brand?.image ?? '')}
            actionButton={menuButton()}
            border={false}
            transparent
          />
        )}
      </Wrapper>
      <div style={pageLoading && !mainDrawerOpen ? { display: 'none' } : {}}>
        <CatchLinkWrapper onLinkClick={onLinkClick}>
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
            autoDeploy={details?.modules[0]?.autoDeploy}
            product={details?.product}
          >
            {renderDrawerPage()}
          </BottomDrawer>
        </CatchLinkWrapper>
      </div>
    </>
  );
};

export default ProductDetails;
