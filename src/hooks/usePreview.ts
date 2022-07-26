import { useGlobal } from 'context/global/GlobalContext';
import { useSuccessDrawerContext } from 'context/SuccessDrawerContext/SuccessDrawerContext';
import { useTranslation } from 'react-i18next';
import getSuccessTitle from 'utils/getSuccessTitle';

export const usePreview = () => {
  const { isPreviewMode, productDetails } = useGlobal();
  const { openDrawer, setMeta, showSuccess } = useSuccessDrawerContext();

  const { t: registrationTranslation } = useTranslation('translation', {
    keyPrefix: 'registration',
  });

  const showSuccessPreviewDrawer = () => {
    openDrawer();

    setTimeout(() => {
      setMeta({
        title:
          productDetails?.registration?.confirmationHeader ||
          registrationTranslation(
            getSuccessTitle(productDetails?.registration?.registrationType)
          ),
        description: productDetails?.registration?.confirmationText,
      });
      showSuccess();

      try {
        window.parent.postMessage({ type: 'userRegistered' }, '*');
      } catch (e) {}
    }, 1000);
  };

  return {
    isPreviewMode,
    showSuccessPreviewDrawer,
  };
};
