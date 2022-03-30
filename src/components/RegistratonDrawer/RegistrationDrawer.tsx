import React, { useCallback, useEffect, useState } from 'react';
import { ModuleInfoType, Product } from '../../types/ProductDetailsType';
import { useGlobal } from '../../context/global/GlobalContext';
import { useTranslation } from 'react-i18next';
import LoadingIndicator from 'components/LoadingIndicator';
import PersonalDetails from 'components/PersonalDetails';
import SuccessDrawer from 'components/SuccessDrawer';
import Wrapper from 'components/Wrapper';

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
};

const canRegister = (product: Product) => {
  if (
    (product?.tagType === 'unit' && product?.registered) ||
    product?.registeredToCurrentUser
  ) {
    return false;
  }

  return true;
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
}) => {
  const [successDrawer, setSuccessDrawer] = useState<boolean>(
    canRegister(product)
  );
  const [showPersonalDetailsForm, togglePersonalDetailsForm] =
    useState<boolean>(isNewUser);

  const { loading, activateWarranty, slug, user, registerProduct } =
    useGlobal();
  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.warrantyDrawer',
  });

  const { t: registrationTranslation } = useTranslation('translation', {
    keyPrefix: 'drawers.registrationDrawer',
  });

  const closeSuccess = useCallback(() => {
    setSuccessDrawer(false);
    closePage();
  }, [closePage]);

  useEffect(() => {
    const checkAndActivateWarranty = async () => {
      activateWarranty({
        warrantyId,
        tag: slug,
      }).then(() => {
        setSuccessDrawer(true);
        setTimeout(() => {
          setSuccessDrawer(false);
        }, 3000);
      });
    };

    const checkAndRegisterProduct = async () => {
      registerProduct().then(() => {
        setSuccessDrawer(true);
        setTimeout(() => {
          setSuccessDrawer(false);
        }, 3000);
      });
    };

    if (user && currentModule?.registrationRequired && canRegister(product)) {
      if (warrantyData) {
        checkAndActivateWarranty();
      } else {
        checkAndRegisterProduct();
      }
    }
  }, [
    slug,
    warrantyId,
    activateWarranty,
    product,
    warrantyData,
    user,
    currentModule,
    registerProduct,
  ]);

  useEffect(() => {
    // only update disableModal when user is loggedIn
    if (user && currentModule.registrationRequired) {
      setDisableModalDismiss(successDrawer);
    }
  }, [
    successDrawer,
    currentModule.registrationRequired,
    setDisableModalDismiss,
    user,
  ]);

  useEffect(() => {
    if (successDrawer) {
      setTimeout(() => {
        setSuccessDrawer(false);
      }, 3000);
    }
  }, [successDrawer]);

  if (!user || !currentModule.registrationRequired) {
    return children;
  }

  if (loading && !successDrawer) {
    return (
      <Wrapper
        justifyContent='center'
        alignItems='center'
        height='100%'
        width='100%'
      >
        <LoadingIndicator />
      </Wrapper>
    );
  }

  const translationToUse = warrantyData ? t : registrationTranslation;

  if (showPersonalDetailsForm) {
    return (
      <PersonalDetails
        onPersonalDetailsUpdate={() => {
          togglePersonalDetailsForm(false);
          onUserUpdate();
        }}
      />
    );
  }

  return (
    <>
      <SuccessDrawer
        isOpen={successDrawer}
        title={translationToUse('successDrawer.title')}
        description={translationToUse('successDrawer.description')}
        close={closeSuccess}
      />
      {children}
    </>
  );
};

export default RegistrationDrawer;
