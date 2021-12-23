import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { ProductDetailsType } from "types/ProductDetailsType";
import { showToast } from "components/Toast/Toast";
import { useHistory } from "react-router";
import { GlobalContext } from "context";
import { getAuth } from "firebase/auth";
import Grid from "components/Grid";
import Text from "components/Text";
import Wrapper from "components/Wrapper";
import ProductImage from "./ProductImage";
import IconButton from "components/IconButton";
import PageHeader from "components/PageHeader";
import LoadingIndicator from "components/LoadingIndicator";

const Collection: React.FC = () => {
  const [collection, setCollection] = useState<ProductDetailsType[]>([]);
  const [token, setToken] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setIsMenuOpen } = useContext(GlobalContext);
  const history = useHistory();
  const auth = getAuth();

  useEffect(() => {
    async function fetchData() {
      const token = await auth?.currentUser?.getIdToken();
      setToken(token);
    }
    fetchData();
  }, [auth.currentUser]);

  useEffect(() => {
    async function getCollection() {
      setLoading(true);
      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      fetch("https://damp-wave-40564.herokuapp.com/products/collection", {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((result) => {
          setCollection(result);
          setLoading(false);
        })
        .catch((error) => {
          showToast({ message: error.message, type: "error" });
          setLoading(false);
        });
    }
    if (token) getCollection();
  }, [token]);

  const setMenuOpen = useCallback(() => setIsMenuOpen(true), [setIsMenuOpen]);

  const menuButton = useMemo(
    () => (
      <Wrapper width="100%" justifyContent="flex-end">
        <IconButton theme="dark" iconName="menu" onClick={setMenuOpen} />
      </Wrapper>
    ),
    [setMenuOpen]
  );

  const renderCollection = useCallback(() => {
    return collection?.map((node: ProductDetailsType) => {
      return (
        <Grid
          margin="1rem 0"
          templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
        >
          <ProductImage
            item={node}
            goToDetails={() => history.push(`/product/${node.tag.slug}`)}
          />
        </Grid>
      );
    });
  }, [collection, history]);

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      overflow="auto"
    >
      <PageHeader title="My Collection" actionButton={menuButton} />
      {loading ? (
        <LoadingIndicator />
      ) : (
        <Wrapper
          width="100%"
          height="100%"
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          padding="1.5rem 1rem"
        >
          <Wrapper width="100%" justifyContent="flex-start">
            <Text fontSize="1rem" fontWeight="600" textTransform="uppercase">
              <h2>({collection?.length})</h2>
            </Text>
          </Wrapper>
          {renderCollection()}
        </Wrapper>
      )}
    </Wrapper>
  );
};

export default Collection;
