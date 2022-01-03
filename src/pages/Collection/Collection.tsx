import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { ReactComponent as ScanIcon } from "assets/icons/svg/scan-code.svg";
import { ProductDetailsType } from "types/ProductDetailsType";
import { showToast } from "components/Toast/Toast";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { GlobalContext } from "context";
import { getAuth } from "firebase/auth";
import Grid from "components/Grid";
import Text from "components/Text";
import QrReader from "react-qr-reader";
import Button from "components/Button";
import Wrapper from "components/Wrapper";
import logEvent from "utils/eventLogger";
import ProductImage from "./ProductImage";
import IconButton from "components/IconButton";
import PageHeader from "components/PageHeader";
import LoadingIndicator from "components/LoadingIndicator";

const Collection: React.FC = () => {
  const [collection, setCollection] = useState<ProductDetailsType[]>([]);
  const [scanMode, toggleScanMode] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any>("");
  const [token, setToken] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { setIsMenuOpen } = useContext(GlobalContext);

  const { t } = useTranslation("translation", { keyPrefix: "collection" });
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

  // useEffect(() => {
  //   const sortCollection = (collection: ProductDetailsType[]) => {
  //     const sorted = collection.sort(
  //       (a, b) =>
  //         new Date(b?.product?.registeredDate).valueOf() -
  //         new Date(a?.product?.registeredDate).valueOf()
  //     );
  //     setCollection(sorted);
  //   };
  //   if (collection.length > 0) {
  //     sortCollection(collection);
  //   };
  // }, [collection])

  const setMenuOpen = useCallback(() => setIsMenuOpen(true), [setIsMenuOpen]);

  const menuButton = useMemo(
    () => (
      <Wrapper width="100%" justifyContent="flex-end">
        <IconButton variant="dark" iconName="menu" onClick={setMenuOpen} />
      </Wrapper>
    ),
    [setMenuOpen]
  );

  const renderCollection = useCallback(() => {
    return (
      <Grid
        margin="1rem 0"
        templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
        width={collection.length === 1 ? "max-content" : "100%"}
      >
        {collection.map((node: ProductDetailsType) => {
          return (
            <ProductImage
              item={node}
              key={node.product.id}
              goToDetails={() => {
                history.push(`/product/${node.tag.slug}`);
                logEvent({
                  eventType: "EVENT_COLLECTION",
                  event: "PRODUCT_CLICKED",
                  data: node.product
                });
              }}
            />
          )
        })}
      </Grid>
    );
  }, [collection, history]);

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="flex-start"
      overflow="auto"
    >
      <PageHeader title={t("collectionPageTitle")} actionButton={menuButton} />
      {loading ? (
        <LoadingIndicator />
      ) : (
        collection?.length > 0 ? (
          scanMode ? (
            <Wrapper
              direction="column"
              width="100%"
              alignSelf="flex-start"
              justifyContent="center"
              padding="0 1.25rem"
              margin="3rem 0"
            >
              <QrReader
                delay={500}
                onError={() => showToast({ message: t("scanErrorMessage"), type: "error" })}
                onScan={(data) => {
                  if (data) {
                    setScanResult(data);
                    toggleScanMode(false);
                    window.open(data, "_blank");
                    showToast({ message: t("scanSuccessMessage"), type: "success" });
                    logEvent({ eventType: "EVENT_SCAN", event: "SCAN_TAG", data: data });
                  };
                }}
              />
            </Wrapper>
          ) : (
            <Wrapper
              width="100%"
              height="100%"
              direction="column"
              justifyContent="flex-start"
              padding="0 1.25rem"
              margin="2.25rem 0 0 0"
              alignItems="flex-start"
            >
              <Wrapper width="100%" justifyContent="flex-start">
                <Text fontSize="1rem" fontWeight="600">
                  <h2>{brandName}{" "}({collection?.length})</h2>
                </Text>
              </Wrapper>
              {renderCollection()}
            </Wrapper>
          )
        ) : (
          <Wrapper
            width="100%"
            height="100%"
            justifyContent="center"
            padding="0 1.25rem"
            margin="0 0 4rem 0"
            alignItems="center"
          >
            <h4>{t("emptyCollectionMessage")}</h4>
          </Wrapper>
        )
      )}
      <Wrapper
        width="170px"
        direction="column"
        justifyContent="center"
        alignItems="center"
        alignSelf="center"
        position="absolute"
        margin="auto"
        bottom="2.5rem"
      >
        {scanMode ? (
          <IconButton variant="dark" iconName="close-light" onClick={() => toggleScanMode(false)} />
        ) : (
          <Button variant="dark" onClick={() => toggleScanMode(!scanMode)}>
            <ScanIcon />
            <Text color="#FFFFFF" padding="0 0 0 1.5rem">
              <p>{t("scanCodeButton")}</p>
            </Text>
          </Button>
        )}
      </Wrapper>
    </Wrapper>
  );
};

export default Collection;

const brandName: string = "Canopy";
