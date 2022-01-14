import React, { useCallback, useEffect, useState } from 'react';
import { ReactComponent as Info } from 'assets/icons/svg/info-outline.svg';
import { WarrantyModuleType } from '../../types/ProductDetailsType';
import { useGlobal } from '../../context/global/GlobalContext';
import { useTranslation } from 'react-i18next';
import { Animated } from 'react-animated-css';
import LoadingIndicator from 'components/LoadingIndicator';
import SuccessDrawer from 'components/SuccessDrawer';
import DetailsModal from './DetailsModal';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';

type WarrantyDrawerProps = {
  closePage(): void;
  drawerTitle: string;
  warrantyId: string;
  warrantyData: WarrantyModuleType;
};

const WarrantyDrawer: React.FC<WarrantyDrawerProps> = ({
  closePage,
  drawerTitle,
  warrantyData,
  warrantyId,
}) => {
  const [successDrawer, setSuccessDrawer] = useState<boolean>(!warrantyData?.activated);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const { loading, activateWarranty, slug } = useGlobal();
  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.warrantyDrawer',
  });

  const closeSuccess = useCallback(() => {
    setIsDetailsOpen(false);
    setSuccessDrawer(false);
    closePage();
  }, [closePage]);

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  const confirmWarranty = () => {
    setSuccessDrawer(true);
  };

  useEffect(() => {
    const checkAndActivateWarranty = async () => {
      activateWarranty({
        warrantyId,
        tag: slug
      })
        .then(() => {
          setSuccessDrawer(true);
          setTimeout(() => {
            setSuccessDrawer(false);
          }, 3000);
        });
    };
    if (!warrantyData?.activated) {
      checkAndActivateWarranty();
    }
  }, [warrantyData?.activated, warrantyId, activateWarranty]);

  useEffect(() => {
    if (successDrawer) {
      setTimeout(() => {
        setIsDetailsOpen(false);
      }, 1000);
    }
  }, [successDrawer, closePage]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (successDrawer) {
    return (
      <SuccessDrawer
        isOpen={true}
        title={t('successDrawer.title')}
        description={t('successDrawer.description')}
        close={closeSuccess}
      />
    );
  };

  return (
    <>
      <DetailsModal
        isOpen={isDetailsOpen}
        close={closeDetails}
        warrantyActivated={warrantyData?.activated}
        confirmWarranty={confirmWarranty}
      />
      <Wrapper
        direction='column'
        alignItems='flex-start'
        justifyContent='flex-start'
      >
        <Text
          fontSize='1rem'
          fontWeight='600'
          margin='1.25rem 3rem 1.25rem 1rem'
        >
          <h1>{drawerTitle}</h1>
        </Text>
        <Animated
          animationIn="slideInRight"
          animationOut="slideOutLeft"
          isVisible={true}
        >
          <Wrapper
            width='100%'
            gap='0.75rem'
            direction='column'
            padding='0 1rem'
            dangerouslySetInnerHTML={{ __html: warrantyData?.details }}
          />
          <Wrapper
            width='100%'
            direction='column'
            padding='1rem'
            gap='0.3rem'
            margin='0.5rem'
          >
            <Text fontSize='0.8rem' color='#98A3AA'>
              <p>{t('details')}</p>
            </Text>
            <Wrapper
              width='100%'
              direction='column'
              gap='0.5rem'
              padding='0 0 1.5rem'
            >
              <Wrapper width='100%' alignItems='center'>
                <Wrapper width='45%' alignItems='center'>
                  <Text fontSize='0.8rem' color='#1b1b1b'>
                    <p>{t('duration')}</p>
                  </Text>
                </Wrapper>
                <Wrapper width='45%' alignItems='center'>
                  <Text fontSize='0.8rem' color='#1b1b1b' fontWeight='700'>
                    <p>
                      {warrantyData?.period} {warrantyData?.duration?.label}
                    </p>
                  </Text>
                </Wrapper>
                <Wrapper width='10%' alignItems='center'>
                  <Info />
                </Wrapper>
              </Wrapper>
              <Wrapper width='100%'>
                <Wrapper width='45%' alignItems='center'>
                  <Text fontSize='0.8rem' color='#1b1b1b'>
                    <p>{t('status')}</p>
                  </Text>
                </Wrapper>
                <Wrapper width='45%' alignItems='center'>
                  <Text fontSize='0.8rem' color='#1b1b1b' fontWeight='700'>
                    <p>
                      {warrantyData?.activated
                        ? 'Activated'
                        : 'Not Activated'}
                    </p>
                  </Text>
                </Wrapper>
                <Wrapper width='10%' alignItems='center'></Wrapper>
              </Wrapper>
              {warrantyData?.activated && (
                <>
                  <Wrapper width='100%'>
                    <Wrapper width='45%' alignItems='center'>
                      <Text fontSize='0.8rem' color='#1b1b1b'>
                        <p>{t('purchaseDate')}</p>
                      </Text>
                    </Wrapper>
                    <Wrapper width='45%' alignItems='center'>
                      <Text
                        fontSize='0.8rem'
                        color='#1b1b1b'
                        fontWeight='700'
                      >
                        <p>{warrantyData?.purchaseDate?.substr(0, 10)}</p>
                      </Text>
                    </Wrapper>
                    <Wrapper width='10%' alignItems='center'></Wrapper>
                  </Wrapper>
                  <Wrapper width='100%'>
                    <Wrapper width='45%' alignItems='center'>
                      <Text fontSize='0.8rem' color='#1b1b1b'>
                        <p>{t('expires')}</p>
                      </Text>
                    </Wrapper>
                    <Wrapper width='45%' alignItems='center'>
                      <Text
                        fontSize='0.8rem'
                        color='#1b1b1b'
                        fontWeight='700'
                      >
                        <p>{warrantyData?.expirationDate?.substr(0, 10)}</p>
                      </Text>
                    </Wrapper>
                  </Wrapper>
                </>
              )}
            </Wrapper>
          </Wrapper>
        </Animated>
      </Wrapper>
    </>
  );
};

export default WarrantyDrawer;
