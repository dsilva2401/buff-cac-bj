import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ReactComponent as ScanIcon } from 'assets/icons/svg/scan-code.svg';
import { useGlobal } from '../../context/global/GlobalContext';
import { ProductDetailsType } from 'types/ProductDetailsType';
import { showToast } from 'components/Toast/Toast';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { GlobalContext } from 'context';
import { RoutesHashMap } from 'routes';
import { Helmet } from 'react-helmet';
import Text from 'components/Text';
import Grid from 'components/Grid';
import Button from 'components/Button';
import Wrapper from 'components/Wrapper';
import IconButton from 'components/IconButton';
import PageHeader from 'components/PageHeader';
import LoadingIndicator from 'components/LoadingIndicator';
import ProductImage from './ProductImage';
import QrReader from 'react-qr-reader';

type BrandCollectionType = {
  brand: string;
  items: ProductDetailsType[];
};

const regexExp = process.env.REACT_APP_SCAN_VERIFICATION + '[a-zA-Z0-9]+';

const Collection: React.FC = () => {
  const [sortedCollection, setSortedCollection] = useState<
    BrandCollectionType[]
  >([]);
  const [scanMode, toggleScanMode] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const { t } = useTranslation('translation', { keyPrefix: 'collection' });
  const { setIsMenuOpen, logEvent } = useContext(GlobalContext);
  const { collectionDetails, getCollection, token } = useGlobal();
  const history = useHistory();

  useEffect(() => {
    const validateUrl = (url: string) => {
      const regex = new RegExp(regexExp);
      return regex.test(url);
    };
    if (scanResult) {
      if (validateUrl(scanResult.toString())) {
        window.open(scanResult, '_self');
        showToast({
          message: t('scanSuccessMessage'),
          type: 'success',
        });
        logEvent({
          eventType: 'ENGAGEMENTS',
          event: 'USER_SCAN_A_TAG',
          data: scanResult.slice(scanResult.length - 4),
        });
      } else if (!validateUrl(scanResult.toString())) {
        showToast({
          message: t('invalidScanMessage'),
          type: 'error',
        });
      } else {
        showToast({
          message: t('scanErrorMessage'),
          type: 'error',
        });
      }
      setScanResult('');
    }
  }, [scanResult, logEvent, t]);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!token) {
        return;
      }

      setLoading(true);
      await getCollection();
      setLoading(false);
    };
    fetchCollection();
  }, [getCollection, token]);

  useEffect(() => {
    const allBrandsArr = new Set(
      collectionDetails.map((item) => item.brand.name)
    );
    const outputArr: BrandCollectionType[] = [];
    allBrandsArr.forEach((brandName) => {
      outputArr.push({
        brand: brandName,
        items: collectionDetails
          .filter((item) => item.brand.name === brandName)
          .sort(
            (a, b) =>
              new Date(b?.product?.registeredDate).valueOf() -
              new Date(a?.product?.registeredDate).valueOf()
          ),
      });
    });
    setSortedCollection(outputArr);
  }, [collectionDetails]);

  const setMenuOpen = useCallback(() => setIsMenuOpen(true), [setIsMenuOpen]);

  const menuButton = useMemo(
    () => (
      <Wrapper width='100%' justifyContent='flex-end'>
        <IconButton variant='dark' iconName='menu' onClick={setMenuOpen} />
      </Wrapper>
    ),
    [setMenuOpen]
  );

  const renderCollection = useCallback(
    (items: ProductDetailsType[]) => {
      return (
        <Grid
          margin='1rem 0'
          key={items[0]?.brand?.id}
          width={items.length === 1 ? 'calc(50% - 8px)' : '100%'}
          templateColumns={`repeat(auto-fit, minmax(40%, 1fr))`}
        >
          {items.map((node) => {
            return (
              <ProductImage
                item={node}
                key={node.tag.slug}
                goToDetails={() => {
                  history.push(
                    RoutesHashMap.ProductDetails.path(node.tag.slug)
                  );
                  logEvent({
                    eventType: 'ENGAGEMENTS',
                    event: 'VIEW_PRODUCT_INFO',
                    data: node.product,
                  });
                }}
              />
            );
          })}
        </Grid>
      );
    },
    [history, logEvent]
  );

  return (
    <>
      <Helmet>
        <title>{t('pageTitle')}</title>
      </Helmet>
      <Wrapper
        width='100%'
        height='100%'
        direction='column'
        justifyContent='flex-start'
        position='relative'
        overflow='auto'
      >
        <PageHeader
          title={t('collectionPageTitle')}
          actionButton={menuButton}
        />
        {loading ? (
          <LoadingIndicator />
        ) : scanMode ? (
          <Wrapper
            direction='column'
            width='100%'
            alignSelf='flex-start'
            justifyContent='center'
            padding='0 1.25rem'
            margin='3rem 0'
          >
            <QrReader
              delay={50}
              onError={() =>
                showToast({ message: t('scanErrorMessage'), type: 'error' })
              }
              onScan={(data) => {
                if (data) {
                  toggleScanMode(false);
                  setScanResult(data);
                }
              }}
            />
          </Wrapper>
        ) : sortedCollection?.length > 0 ? (
          <Wrapper
            width='100%'
            height='100%'
            direction='column'
            justifyContent='flex-start'
            padding='0 1.25rem'
            margin='2.25rem 0 7.5rem 0'
            alignItems='flex-start'
          >
            {sortedCollection.map((item) => (
              <Wrapper width='100%' key={item.brand} direction='column'>
                <Wrapper width='100%' justifyContent='flex-start'>
                  <Text fontSize='1rem' fontWeight='600'>
                    <h2>
                      {item.brand} ({item.items.length})
                    </h2>
                  </Text>
                </Wrapper>
                {renderCollection(item.items)}
              </Wrapper>
            ))}
          </Wrapper>
        ) : (
          <Wrapper
            width='100%'
            height='100%'
            justifyContent='center'
            padding='0 1.25rem'
            margin='0 0 4rem 0'
            alignItems='center'
          >
            <h4>{t('emptyCollectionMessage')}</h4>
          </Wrapper>
        )}
        {!loading && (
          <Wrapper
            width='170px'
            direction='column'
            justifyContent='center'
            alignItems='center'
            alignSelf='center'
            position='fixed'
            bottom='2.5rem'
            margin='auto'
          >
            {scanMode ? (
              <IconButton
                variant='dark'
                iconName='close-light'
                onClick={() => toggleScanMode(false)}
              />
            ) : (
              <Button variant='dark' onClick={() => toggleScanMode(!scanMode)}>
                <ScanIcon />
                <Text color='#FFFFFF' padding='0 0 0 1.5rem'>
                  <p>{t('scanCodeButton')}</p>
                </Text>
              </Button>
            )}
          </Wrapper>
        )}
      </Wrapper>
    </>
  );
};

export default Collection;
