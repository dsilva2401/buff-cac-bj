import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { GlobalContext } from 'context';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { showToast } from 'components/Toast/Toast';
import { ProductDetailsType } from 'types/ProductDetailsType';
import { useGlobal } from '../../context/global/GlobalContext';
import { ReactComponent as ScanIcon } from 'assets/icons/svg/scan-code.svg';
import LoadingIndicator from 'components/LoadingIndicator';
import IconButton from 'components/IconButton';
import PageHeader from 'components/PageHeader';
import ProductImage from './ProductImage';
import logEvent from 'utils/eventLogger';
import Wrapper from 'components/Wrapper';
import QrReader from 'react-qr-reader';
import Button from 'components/Button';
import Grid from 'components/Grid';
import Text from 'components/Text';
import { RoutesHashMap } from 'routes';

type BrandCollectionType = {
  brand: string;
  items: ProductDetailsType[];
};

const Collection: React.FC = () => {
  const { collectionDetails, getCollection } = useGlobal();
  const [sortedCollection, setSortedCollection] = useState<
    BrandCollectionType[]
  >([]);
  const [scanMode, toggleScanMode] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const { t } = useTranslation('translation', { keyPrefix: 'collection' });
  const { setIsMenuOpen } = useContext(GlobalContext);
  const history = useHistory();

  useEffect(() => {
    if (scanResult) {
      window.open(scanResult, '_blank');
      setScanResult('');
    }
  }, [scanResult]);

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
          templateColumns='repeat(auto-fit, minmax(150px, 1fr))'
          width={items.length === 1 ? 'max-content' : '100%'}
        >
          {items.map((node) => {
            return (
              <ProductImage
                item={node}
                key={node.product.id}
                goToDetails={() => {
                  history.push(RoutesHashMap.ProductDetails.path(node.tag.slug));
                  logEvent({
                    eventType: 'EVENT_COLLECTION',
                    event: 'PRODUCT_CLICKED',
                    data: node.product,
                  });
                }}
              />
            );
          })}
        </Grid>
      );
    },
    [sortedCollection, history]
  );

  return (
    <Wrapper
      width='100%'
      height='100%'
      direction='column'
      justifyContent='flex-start'
      overflow='auto'
    >
      <PageHeader title={t('collectionPageTitle')} actionButton={menuButton} />
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
                  showToast({
                    message: t('scanSuccessMessage'),
                    type: 'success',
                  });
                  logEvent({
                    eventType: 'EVENT_SCAN',
                    event: 'SCAN_TAG',
                    data: data,
                  });
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
            margin='2.25rem 0 0 0'
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
        position='absolute'
        margin='auto'
        bottom='2.5rem'
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
  );
};

export default Collection;
