import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useGlobal } from '../../context/global/GlobalContext';
import { ProductDetailsType } from 'types/ProductDetailsType';
import { getRedirectResult, getAuth } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { GlobalContext } from 'context';
import { RoutesHashMap } from 'routes';
import { Helmet } from 'react-helmet';
import Text from 'components/Text';
import Grid from 'components/Grid';
import Wrapper from 'components/Wrapper';
import IconButton from 'components/IconButton';
import PageHeader from 'components/PageHeader';
import LoadingIndicator from 'components/LoadingIndicator';
import ProductImage from './ProductImage';

type BrandCollectionType = {
  brand: string;
  items: ProductDetailsType[];
};

const Collection: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [sortedCollection, setSortedCollection] = useState<
    BrandCollectionType[]
  >([]);

  const { t } = useTranslation('translation', { keyPrefix: 'collection' });
  const { setIsMenuOpen, logEvent } = useContext(GlobalContext);
  const { collectionDetails, getCollection, token } = useGlobal();
  const history = useHistory();

  useEffect(() => {
    const fetchCollection = async () => {
      if (!token) return;
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
      >
        <PageHeader
          title={t('collectionPageTitle')}
          actionButton={menuButton}
        />
        {loading ? (
          <LoadingIndicator />
        ) : sortedCollection?.length > 0 ? (
          <Wrapper
            width='100%'
            direction='column'
            justifyContent='flex-start'
            padding='2.25rem 1.25rem'
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
      </Wrapper>
    </>
  );
};

export default Collection;
