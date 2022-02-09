import React, { useCallback, useEffect, useState } from 'react';
import { ReactComponent as Info } from 'assets/icons/svg/info-outline.svg';
import { ReactComponent as Arrow } from 'assets/icons/svg/arrow-small.svg';
import { WarrantyModuleType } from '../../types/ProductDetailsType';
import { useGlobal } from '../../context/global/GlobalContext';
import { useTranslation } from 'react-i18next';
import { Animated } from 'react-animated-css';
import { theme } from 'styles/theme';
import Text from 'components/Text';
import Image from 'components/Image';
import Wrapper from 'components/Wrapper';
import DetailsModal from './DetailsModal';
import DataTable from 'components/DataTable';
import mulberryLogo from 'assets/logos/svg/mulberry-logo.svg';
import externalLink from 'assets/icons/svg/external-link.svg';
import LoadingIndicator from 'components/LoadingIndicator';
import SuccessDrawer from 'components/SuccessDrawer';
import useElementSize from 'hooks/useElementSize';
import HtmlWrapper from 'components/HtmlWrapper';

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
  const [expandCoverage, toggleCoverage] = useState<boolean>(false);
  const [animateTable, toggleAnimateTable] = useState<boolean>(false);
  const [tableRef, { height }] = useElementSize();

  const { loading, activateWarranty, slug, retractDrawer } = useGlobal();
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
  }, [warrantyData?.activated, slug, warrantyId, activateWarranty]);

  useEffect(() => {
    if (successDrawer) {
      setTimeout(() => {
        setIsDetailsOpen(false);
      }, 1000);
    }
  }, [successDrawer, closePage]);

  if (loading && !successDrawer) {
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
        width='100%'
        direction='column'
        alignItems='flex-start'
        justifyContent='flex-start'
      >
        {mulberryCoverage.coverage ? (
          <Image src={mulberryLogo} margin='1.25rem 3rem 1.25rem 0.75rem' />
        ) : (
          <Text
            fontSize='1rem'
            fontWeight='600'
            margin='1.25rem 3rem 1.25rem 0.75rem'
          >
            <h1>{drawerTitle}</h1>
          </Text>
        )}
        <Animated
          animationIn='slideInRight'
          animationOut='slideOutLeft'
          animationInDuration={retractDrawer ? 0 : 300}
          animationOutDuration={retractDrawer ? 0 : 300}
          animationInDelay={retractDrawer ? 200 : 0}
          isVisible={true}
          style={{ width: '100%' }}
        >
          <HtmlWrapper
            width='100%'
            padding='0 0.75rem'
            direction='column'
            dangerouslySetInnerHTML={{ __html: warrantyData?.details }}
          />
            {mulberryCoverage.coverage && (
              <Wrapper
                width='100%'
                direction='column'
                alignItems='center'
                justifyContent='flex-start'
                padding='0 0.75rem'
                margin='1rem 0 0 0'
                gap='1rem'
              >
                <Wrapper
                  width='100%'
                  gap='0.5rem'
                  cursor='pointer'
                  alignItems='center'
                  justifyContent='center'
                  onClick={() => {
                    toggleCoverage(!expandCoverage);
                    toggleAnimateTable(true);
                  }}
                >
                  <Text
                    fontSize='1rem'
                    fontWeight='600'
                    color='#202029'
                    textDecoration='underline'
                  >
                    <span>{t('warrantyCoverage')}</span>
                  </Text>
                  <Arrow
                    style={{
                      transform: expandCoverage ? 'rotate(0deg)' : 'rotate(180deg)',
                      transition: '0.4s'
                    }}
                  />
                </Wrapper>
                <Wrapper overflow='hidden'>
                  <Wrapper
                    ref={tableRef}
                    height='100%'
                    gap='0.5rem'
                    transition='0.3s'
                    direction='column'
                    style={{ transform: expandCoverage ? 'translateY(0)' : 'translateY(-101%)' }}
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
                        <p>{t('fullTermsLink')}</p>
                      </Text>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
            )}
          <Wrapper
            width='100%'
            direction='column'
            alignItems='center'
            justifyContent='flex-start'
            padding='0 0.75rem'
            margin='1rem 0 0 0'
            gap='1rem'
          >
            <Wrapper
              width='100%'
              gap='0.5rem'
              cursor='pointer'
              alignItems='center'
              justifyContent='center'
              onClick={() => {
                toggleCoverage(!expandCoverage);
                toggleAnimateTable(true);
              }}
            >
              <Text
                fontSize='1rem'
                fontWeight='600'
                color='#202029'
                textDecoration='underline'
              >
                <span>{t('warrantyCoverage')}</span>
              </Text>
              <Arrow
                style={{
                  transform: expandCoverage ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: '0.4s'
                }}
              />
            </Wrapper>
            <Wrapper overflow='hidden'>
              <Wrapper
                ref={tableRef}
                height='100%'
                gap='0.5rem'
                transition='0.3s'
                direction='column'
                style={{ transform: expandCoverage ? 'translateY(0)' : 'translateY(-101%)' }}
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
                    <p>{t('fullTermsLink')}</p>
                  </Text>
                </Wrapper>
              </Wrapper>
            </Wrapper>
          </Wrapper>
          <Wrapper
            width='100%'
            gap='0.3rem'
            direction='column'
            padding='0 0.75rem'
            transition={animateTable ? '0.3s' : '0'}
            margin={mulberryCoverage.coverage ? '0' : '1.25rem 0'}
            style={{ transform: !expandCoverage ? `translateY(-${height}px)` : 'translateY(16px)' }}
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
                        ? t('warrantyStatusActivated')
                        : t('warrantyStatusNotActivated')}
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
