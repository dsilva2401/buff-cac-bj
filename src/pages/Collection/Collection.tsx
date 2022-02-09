import { ReactComponent as ScanIcon } from 'assets/icons/svg/scan-code.svg';
import Button from 'components/Button';
import Grid from 'components/Grid';
import IconButton from 'components/IconButton';
import LoadingIndicator from 'components/LoadingIndicator';
import PageHeader from 'components/PageHeader';
import Text from 'components/Text';
import { showToast } from 'components/Toast/Toast';
import Wrapper from 'components/Wrapper';
import { GlobalContext } from 'context';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import QrReader from 'react-qr-reader';
import { useHistory } from 'react-router';
import { RoutesHashMap } from 'routes';
import { ProductDetailsType } from 'types/ProductDetailsType';
import { useGlobal } from '../../context/global/GlobalContext';
import ProductImage from './ProductImage';

type BrandCollectionType = {
  brand: string;
  items: ProductDetailsType[];
};

const Collection: React.FC = () => {
  const [sortedCollection, setSortedCollection] = useState<
    BrandCollectionType[]
  >([]);
  const [scanMode, toggleScanMode] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const { t } = useTranslation('translation', { keyPrefix: 'collection' });
  const { collectionDetails, getCollection, productDetails, user } =
    useGlobal();
  const { setIsMenuOpen, logEvent } = useContext(GlobalContext);
  const history = useHistory();

  useEffect(() => {
    const validateUrl = (url: string) => {
      const regex = new RegExp(
        '^https://v2.brij.it/r/product/[a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9]$'
      );
      return regex.test(url);
    };
    if (scanResult) {
      if (validateUrl(scanResult.toString())) {
        window.open(scanResult, '_blank');
        showToast({
          message: t('scanSuccessMessage'),
          type: 'success',
        });
        logEvent({
          type: 'ENGAGEMENTS',
          name: 'USER_SCAN_A_TAG',
          data: scanResult,
          brand: productDetails?.brand.id,
          product: productDetails?.product.id,
          user: user?.uid,
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
      setLoading(true);
      await getCollection();
      setLoading(false);
    };
    fetchCollection();
  }, [getCollection]);

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
          width={items.length === 1 ? 'calc(50% - 8px)' : '100%'}
          templateColumns={`repeat(auto-fit, minmax(40%, 1fr))`}
        >
          {items.map((node) => {
            return (
              <ProductImage
                item={node}
                key={node.product.id}
                goToDetails={() => {
                  history.push(
                    RoutesHashMap.ProductDetails.path(node.tag.slug)
                  );
                  logEvent({
                    type: 'ENGAGEMENTS',
                    name: 'VIEW_PRODUCT_INFO',
                    data: node.product,
                    brand: productDetails?.brand.id,
                    product: productDetails?.product.id,
                    user: user?.uid,
                  });
                }}
              />
            );
          })}
        </Grid>
      );
    },
    [history, logEvent, productDetails, user]
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
        ) : sortedCollection?.length > 0 ? (
          scanMode ? (
            <Wrapper
              direction='column'
              width='100%'
              alignSelf='flex-start'
              justifyContent='center'
              padding='0 1.25rem'
              margin='3rem 0'
            >
              <QrReader
                delay={500}
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
          ) : (
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
                <>
                  <Wrapper width='100%' justifyContent='flex-start'>
                    <Text fontSize='1rem' fontWeight='600'>
                      <h2>
                        {item.brand} ({item.items.length})
                      </h2>
                    </Text>
                  </Wrapper>
                  {renderCollection(item.items)}
                </>
              ))}
            </Wrapper>
          )
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
      </Wrapper>
    </>
  );
};

export default Collection;
