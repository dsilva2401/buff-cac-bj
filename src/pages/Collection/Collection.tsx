import React, { useCallback, useContext, useMemo } from "react";
import { GlobalContext } from "context";
import { useHistory } from "react-router";
import { ProductDetailsType } from "types/ProductDetailsType";
import CollectionData from "../../mocks/collection";
import IconButton from "components/IconButton";
import PageHeader from "components/PageHeader";
import ProductImage from "./ProductImage";
import Wrapper from "components/Wrapper";
import Text from "components/Text";
import Grid from "components/Grid";

const Collection: React.FC = () => {
  // const {
  //   collectionDetails: details,
  //   collectionDetailsError: error,
  //   collectionDetailsLoading: loading,
  //   getCollectionDetails,
  // } = useContext(DataContext);

  //collection pulled from mock
  const details = CollectionData;

  const history = useHistory();
  const { setIsMenuOpen } = useContext(GlobalContext);

  // useEffect(() => {
  //   getCollectionDetails();
  // }, []);

  const setMenuOpen = useCallback(() => setIsMenuOpen(true), [setIsMenuOpen]);

  // const setMenuClosed = useCallback(
  //   () => setIsMenuOpen(false),
  //   [setIsMenuOpen]
  // );

  const menuButton = useMemo(
    () => (
      <Wrapper width="100%" justifyContent="flex-end">
        <IconButton theme="dark" iconName="menu" onClick={setMenuOpen} />
      </Wrapper>
    ),
    [setMenuOpen]
  );

  const renderCollections = useCallback(() => {
    return details?.map((collection) => {
      const { brand, products } = collection;
      return (
        <>
          <Wrapper width="100%" justifyContent="flex-start">
            <Text fontSize="1rem" fontWeight="600" textTransform="uppercase">
              <h2>
                {brand} ({products.length})
              </h2>
            </Text>
          </Wrapper>
          <Grid
            margin="1rem 0"
            templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
          >
            {products.map((item: ProductDetailsType) => (
              <ProductImage
                item={item}
                goToDetails={() => history.push(`/product/${item.tag.slug}`)}
              />
            ))}
          </Grid>
        </>
      );
    });
  }, [details, history]);

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      overflow="auto"
    >
      <PageHeader title="My Collection" actionButton={menuButton} />
      <Wrapper
        width="100%"
        height="100%"
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        padding="1.5rem 1rem"
      >
        {renderCollections()}
      </Wrapper>
    </Wrapper>
  );
};

export default Collection;
