import React, { useState } from 'react';
import { ReactComponent as Warning } from 'assets/icons/svg/warning.svg';
import { ReactComponent as Arrow } from 'assets/icons/svg/arrow-small.svg';
import { ReactComponent as Checkmark } from 'assets/icons/svg/checkmark.svg';
import { ReactComponent as ExternalLink } from 'assets/icons/svg/external-link.svg';
import { ReactComponent as MulberryLogo } from 'assets/logos/svg/mulberry-logo.svg';
import { WarrantyModuleType } from '../../types/ProductDetailsType';
import { useGlobal } from '../../context/global/GlobalContext';
import { useTranslation } from 'react-i18next';
import { theme } from 'styles/theme';
import Wrapper from 'components/Wrapper';
import DataTable from 'components/DataTable';
import HtmlWrapper from 'components/HtmlWrapper';
import useElementSize from 'hooks/useElementSize';
import ModuleWrapper from 'components/ModuleWrapper';
import dateFormat from 'dateformat';
import Text from 'components/Text';

type WarrantyDrawerProps = {
  drawerTitle: string;
  warrantyId: string;
  warrantyData: WarrantyModuleType;
};

const validateDate = (date: Date) => {
  return date.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)
    ? true
    : false;
};

const WarrantyInfo = ({
  title,
  issueDate,
  expiryDate,
  expired,
  lifetime,
  brandTheme,
}: {
  title: string;
  issueDate: string;
  expiryDate: string;
  expired: boolean;
  lifetime?: boolean;
  brandTheme?: string;
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.warrantyDrawer',
  });

  return (
    <>
      <Wrapper
        width='100%'
        direction='row'
        background={expired ? '#FFEFEE' : '#EDF0FF'}
        justifyContent='center'
        borderRadius='0.25rem'
        alignItems='center'
        margin='0.75rem 0'
        padding='0.75rem'
      >
        {expired ? (
          <Warning width='15px' height='15px' fill='#FD6157' />
        ) : (
          <Checkmark
            width='15px'
            height='15px'
            fill={brandTheme || theme.primary}
          />
        )}
        <Text
          fontWeight='600'
          textAlign='center'
          fontSize='0.875rem'
          padding='0 0.5rem'
          wrapperWidth='max-content'
          color={expired ? '#FD6157' : brandTheme || theme.primary}
        >
          <p>{title}</p>
        </Text>
      </Wrapper>
      <Wrapper
        width='100%'
        direction='row'
        gap='0.75rem'
        margin='0 0 0.75rem 0'
      >
        <Wrapper
          width='100%'
          gap='0.125rem'
          direction='column'
          background='#FAFAFA'
          alignItems='center'
          justifyContent='center'
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
            <p>{lifetime ? 'Lifetime' : expiryDate}</p>
          </Text>
        </Wrapper>
      </Wrapper>
    </>
  );
};

const WarrantyDrawer: React.FC<WarrantyDrawerProps> = ({
  drawerTitle,
  warrantyData,
}) => {
  const [animateTable, toggleAnimateTable] = useState<boolean>(false);
  const [showCoverageTable, toggleCoverageTable] = useState<boolean>(false);

  const { brandTheme } = useGlobal();
  const [tableRef, { height }] = useElementSize();

  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.warrantyDrawer',
  });

  return (
    <Wrapper overflow='hidden'>
      <ModuleWrapper
        tableShown={showCoverageTable}
        tableHeight={height}
        drawerTitle={
          !warrantyData?.mulberry ? (
            drawerTitle
          ) : (
            <Wrapper width='100%'>
              <MulberryLogo
                width='7.2rem'
                style={{
                  margin: '1.25rem 4rem 1.25rem 1.75rem',
                }}
              />
            </Wrapper>
          )
        }
      >
        <HtmlWrapper
          width='100%'
          direction='column'
          dangerouslySetInnerHTML={{ __html: warrantyData?.details }}
        />
        {warrantyData?.mulberry && (
          <Wrapper width='100%' direction='column'>
            <WarrantyInfo
              title={
                validateDate(
                  new Date(
                    dateFormat(
                      warrantyData?.mulberry?.expirationDate,
                      'mmmm d, yyyy'
                    )
                  )
                )
                  ? t('expiredMulberryWarrantyHeading')
                  : t('mulberryWarrantyHeading')
              }
              issueDate={dateFormat(
                warrantyData!.mulberry!.issueDate,
                'mmmm d, yyyy'
              )}
              expiryDate={dateFormat(
                warrantyData!.mulberry!.expirationDate,
                'mmmm d, yyyy'
              )}
              expired={validateDate(
                new Date(
                  dateFormat(
                    warrantyData!.mulberry!.expirationDate,
                    'mmmm d, yyyy'
                  )
                )
              )}
              brandTheme={brandTheme}
            />
            <Wrapper
              width='100%'
              gap='0.5rem'
              cursor='pointer'
              padding='1rem 0 0 0'
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
                <span>{t('viewDetails')}</span>
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
            <Wrapper overflow='hidden' margin='0 0 1.25rem 0'>
              <Wrapper padding='1px 0 0 0'>
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
                    headers={["What's Covered", 'mulberry', 'Manu. Warranty']}
                    tableData={warrantyData!.mulberry!.coverages}
                  />
                  <Wrapper
                    cursor='pointer'
                    alignItems='center'
                    alignSelf='flex-start'
                    justifyContent='flex-start'
                    onClick={() =>
                      window.open(
                        warrantyData!.mulberry!.policyTermsUrl,
                        '_blank'
                      )
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
                  <Text fontSize='0.75rem'>
                    <p>
                      {t('mulberryTable.description.explanationText')}{' '}
                      <span
                        style={{
                          color: brandTheme || theme.primary,
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          window.open('mailto:help@getmulberry.com')
                        }
                      >
                        {t('mulberryTable.description.linkText')}
                      </span>
                      .
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
          style={{
            transform: !showCoverageTable
              ? `translateY(-${height}px)`
              : 'translateY(0)',
          }}
        >
          <WarrantyInfo
            title={
              warrantyData.duration.value === 'LIFETIME'
                ? t('warrantyHeading')
                : validateDate(
                    new Date(
                      dateFormat(warrantyData.expirationDate, 'mmmm d, yyyy')
                    )
                  )
                ? t('expiredWarrantyHeading')
                : t('warrantyHeading')
            }
            issueDate={dateFormat(warrantyData.purchaseDate, 'mmmm d, yyyy')}
            expiryDate={dateFormat(warrantyData.expirationDate, 'mmmm d, yyyy')}
            expired={
              warrantyData.duration.value === 'LIFETIME'
                ? false
                : validateDate(
                    new Date(
                      dateFormat(warrantyData.expirationDate, 'mmmm d, yyyy')
                    )
                  )
            }
            lifetime={warrantyData.duration.value === 'LIFETIME'}
            brandTheme={brandTheme}
          />
        </Wrapper>
      </ModuleWrapper>
    </Wrapper>
  );
};

export default WarrantyDrawer;
