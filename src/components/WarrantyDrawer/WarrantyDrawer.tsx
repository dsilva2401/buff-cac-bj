import React, { useCallback, useEffect, useState } from 'react';
import { ReactComponent as MulberryLogo } from 'assets/logos/svg/mulberry-logo.svg';
import { ReactComponent as ExternalLink } from 'assets/icons/svg/external-link.svg';
import { ReactComponent as Checkmark } from 'assets/icons/svg/checkmark-white.svg';
import { ReactComponent as Arrow } from 'assets/icons/svg/arrow-small.svg';
import { WarrantyModuleType } from '../../types/ProductDetailsType';
import { useGlobal } from '../../context/global/GlobalContext';
import { useTranslation } from 'react-i18next';
import { Animated } from 'react-animated-css';
import { theme } from 'styles/theme';
import Text from 'components/Text';
import dateFormat from 'dateformat';
import Wrapper from 'components/Wrapper';
import DetailsModal from './DetailsModal';
import DataTable from 'components/DataTable';
import useElementSize from 'hooks/useElementSize';
import LoadingIndicator from 'components/LoadingIndicator';
import ModuleWrapper from 'components/ModuleWrapper';
import SuccessDrawer from 'components/SuccessDrawer';
import HtmlWrapper from 'components/HtmlWrapper';

type WarrantyDrawerProps = {
  closePage(): void;
  drawerTitle: string;
  warrantyId: string;
  warrantyData: WarrantyModuleType;
};

const validateDate = (date: Date) => {
  return (date.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)) ? true : false;
};

const WarrantyDrawer: React.FC<WarrantyDrawerProps> = ({
  closePage,
  drawerTitle,
  warrantyData,
  warrantyId
}) => {
  const [successDrawer, setSuccessDrawer] = useState<boolean>(!warrantyData?.activated);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [animateTable, toggleAnimateTable] = useState<boolean>(false);
  const [showCoverageTable, toggleCoverageTable] = useState<boolean>(false);

  const { loading, activateWarranty, slug, appTheme } = useGlobal();
  const [tableRef, { height }] = useElementSize();
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

  const WarrantyInfo = (
    { title, issueDate, expiryDate, expired }: {
      title: string,
      issueDate: string,
      expiryDate: string,
      expired: boolean,
    }) => (
    <>
      <Wrapper
        gap='0.5rem'
        width='100%'
        direction='row'
        background={expired ? '#FFEFEE' : '#EDF0FF'}
        justifyContent='center'
        borderRadius='0.25rem'
        paddingTop='0.75rem'
        alignItems='center'
        margin='0.75rem 0'
        padding='0.75rem'
      >
        <Checkmark
          width='15px'
          height='15px'
          fill={expired ? '#FD6157' : appTheme || theme.primary}
        />
        <Text
          fontWeight='600'
          fontSize='0.875rem'
          color={expired ? '#FD6157' : appTheme || theme.primary}
        >
          <p>{title}</p>
        </Text>
      </Wrapper>
      <Wrapper width='100%' direction='row' gap='0.75rem' margin='0 0 0.75rem 0'>
        <Wrapper
          width='100%'
          gap='0.125rem'
          direction='column'
          background='#FAFAFA'
          alignItems='center'
          justifyContent='center'
          paddingTop='0.75rem'
          padding='0.75rem'
          border='1px solid #E7EAEB'
        >
          <Text
            fontWeight='500'
            fontSize='0.875rem'
            textAlign='center'
            color='#98A3AA'
          >
            <p>{t('issueDate')}</p>
          </Text>
          <Text
            fontWeight='600'
            fontSize='0.875rem'
            textAlign='center'
            color='#1B1B1B'
          >
            <p>{issueDate}</p>
          </Text>
        </Wrapper>
        <Wrapper
          width='100%'
          gap='0.125rem'
          direction='column'
          background='#FAFAFA'
          alignItems='center'
          justifyContent='center'
          paddingTop='0.75rem'
          padding='0.75rem'
          border='1px solid #E7EAEB'
        >
          <Text
            fontWeight='500'
            fontSize='0.875rem'
            textAlign='center'
            color='#98A3AA'
          >
            <p>{t('expirationDate')}</p>
          </Text>
          <Text
            fontWeight='600'
            fontSize='0.875rem'
            textAlign='center'
            color='#1B1B1B'
          >
            <p>{expiryDate}</p>
          </Text>
        </Wrapper>
      </Wrapper>
    </>
  );

  if (loading && !successDrawer) {
    return <LoadingIndicator />;
  }

  if (successDrawer) {
    return (
      <Animated
        animationIn='slideInUp'
        animationOut='slideOutDown'
        animationInDuration={400}
        animationOutDuration={0}
        isVisible={successDrawer}
        style={{
          width: 'calc(100% + 2rem)',
          height: '100%'
        }}
      >
        <SuccessDrawer
          isOpen={true}
          title={t('successDrawer.title')}
          description={t('successDrawer.description')}
          close={closeSuccess}
        />
      </Animated>
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
      <ModuleWrapper
        drawerTitle={!mulberry ? drawerTitle :
          <Wrapper width='100%'>
            <MulberryLogo
              width='7.2rem'
              style={{ margin: '1.25rem 4rem 1.25rem 1.75rem' }}
            />
          </Wrapper>
        }
      >
        <HtmlWrapper
          width='100%'
          direction='column'
          dangerouslySetInnerHTML={{ __html: warrantyData?.details }}
        />
        {mulberry && (
          <Wrapper width='100%' direction='column'>
            <WarrantyInfo
              title={validateDate(new Date(dateFormat(mulberry.expiryDate, 'mmmm d, yyyy')))
                ? t('expiredMulberryWarrantyHeading') : t('mulberryWarrantyHeading')}
              issueDate={dateFormat(mulberry.issueDate, 'mmmm d, yyyy')}
              expiryDate={dateFormat(mulberry.expiryDate, 'mmmm d, yyyy')}
              expired={validateDate(new Date(dateFormat(mulberry.expiryDate, 'mmmm d, yyyy')))}
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
                <span>{t('viewDetails')}</span>
              </Text>
              <Arrow
                style={{
                  transform: showCoverageTable ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: '0.4s'
                }}
              />
            </Wrapper>
            <Wrapper overflow='hidden' margin='0 0 1.25rem 0'>
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
                    headers={["What's Covered", "mulberry", "Manu. Warranty"]}
                    tableData={mulberry.coverageDetails}
                  />
                  <Wrapper
                    cursor='pointer'
                    alignItems='center'
                    alignSelf='flex-start'
                    justifyContent='flex-start'
                    onClick={() => window.open(mulberry.policyTermsUrl, '_blank')}
                  >
                    <ExternalLink
                      fill={appTheme || theme.primary}
                      style={{ margin: '-0.05rem 0.25rem 0 0' }}
                    />
                    <Text
                      fontSize='0.75rem'
                      fontWeight='500'
                      color={appTheme || theme.primary}
                    >
                      <p>{t('fullTermsLink')}</p>
                    </Text>
                  </Wrapper>
                  <Text fontSize='0.75rem'>
                    <p>
                      To extend protection or file a claim, click the account activation link that was sent to your email from Mulberry. You can also reach out to Mulberry support <span style={{ color: appTheme || theme.primary, cursor: 'pointer' }} onClick={() => window.open('mailto:help@getmulberry.com')}>here</span>.
                    </p>
                  </Text>
                </Wrapper>
              </Wrapper>
            </Wrapper>
          </Wrapper>
        )}
        <Wrapper
          width='100%'
          direction='column'
          transition={animateTable ? '0.3s' : '0'}
          style={{ transform: !showCoverageTable ? `translateY(-${height}px)` : 'translateY(0)' }}
        >
          <WarrantyInfo
            title={validateDate(new Date(dateFormat(warrantyData.expirationDate, 'mmmm d, yyyy')))
              ? t('expiredWarrantyHeading') : t('warrantyHeading')}
            issueDate={dateFormat(warrantyData.purchaseDate, 'mmmm d, yyyy')}
            expiryDate={dateFormat(warrantyData.expirationDate, 'mmmm d, yyyy')}
            expired={validateDate(new Date(dateFormat(warrantyData.expirationDate, 'mmmm d, yyyy')))}
          />
        </Wrapper>
      </ModuleWrapper>
    </>
  );
};

export default WarrantyDrawer;

// const mulberry = null;
const mulberry = {
  isCovered: true,
  coverageDetails: [
    'Manufacturing defects',
    'Damange from stains, rips & tears',
    'Damage from liquid marks & rings',
    'Broken heating, reclining & vibration',
    'Broken mirrors & glass, loss of mirror silvering'
  ],
  policyTermsUrl: 'https://www.google.com',
  warrantyOfferId: '12345678',
  issueDate: '2022-02-28T16:55:40.012Z',
  expiryDate: '2023-02-28T16:55:40.012Z',
};
