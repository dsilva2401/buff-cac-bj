import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import { productDataWithoutUserToken as productNoToken } from "mocks/products";
import { productDataWithUserToken as productToken } from "mocks/products";
import { ProductDetailsType } from "types/ProductDetailsType";
import { PageStateType } from "context/global/GlobalContext";
import { useParams } from "react-router";
import { GlobalContext } from "context";
import { getAuth } from "firebase/auth";
import LoadingIndicator from "components/LoadingIndicator";
import WarrantyDrawer from "components/WarrantyDrawer";
import CustomDrawer from "components/CustomDrawer";
import BottomDrawer from "components/BottomDrawer";
import LinkModule from "components/LinkModule";
import IconButton from "components/IconButton";
import PageHeader from "components/PageHeader";
import Wrapper from "components/Wrapper";
import Image from "components/Image";

type UrlParam = {
  id: string;
};

type ButtonType = {
  title: string | undefined;
  onClick: () => void;
  isHighlight: boolean;
  locked: boolean;
  pageState: PageStateType;
};

const ProductDetails: React.FC = () => {
  const [details, setDetails] = useState<ProductDetailsType | undefined>(
    undefined
  );
  const [isDrawerPageOpen, setIsDrawerPageOpen] = useState<boolean>(false);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string | undefined>("");
  const [currentPage, setCurrentPage] = useState<number>(0);

  const context = useContext(GlobalContext);
  const { id } = useParams<UrlParam>();
  const auth = getAuth();

  // either to load data from local source or from an API call
  const localDataSource = false;

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) setAuthenticated(true);
      else setAuthenticated(false);
    });
  }, [auth]);

  useEffect(() => {
    if (id) {
      if (localDataSource) {
        if (isAuthenticated) {
          setDetails(productToken);
        }
        setDetails(productNoToken);
      } else {
        fetch(`https://damp-wave-40564.herokuapp.com/products/${id}`, {
          method: "GET",
          redirect: "follow",
        })
          .then((response) => response.json())
          .then((result) => {
            setDetails(result);
          })
          .catch((error) => {
            console.log("ERROR CODE: ", error.code);
            console.log("ERROR MSG: ", error.message);
          });
      }
    }
  }, [id, localDataSource, isAuthenticated]);

  useEffect(() => {
    if (!!details && !isDrawerPageOpen) {
      setPageTitle(details?.product.name);
    }
  }, [isDrawerPageOpen, details, currentPage]);

  const closeDrawerPage = useCallback(() => {
    setCurrentPage(0);
    setIsDrawerPageOpen(false);
  }, []);

  const changeDrawerPage = useCallback(
    (index, moduleType) => {
      setCurrentPage(index);
      setIsDrawerPageOpen(moduleType !== "LINK_MODULE");
      if (moduleType !== "LINK_MODULE")
        setPageTitle(details?.modules[index].title);
    },
    [details]
  );

  let buttonsArray = useMemo(() => {
    let arr: ButtonType[] = [];
    if (details) {
      for (let x = 0; x < details?.modules?.length; x++) {
        if (details?.modules[x]?.locked) {
          context.setSignInRedirect(`/product/${id}`);
        }
        let buttonObject: ButtonType = {
          title: details?.modules[x].title,
          onClick: () => changeDrawerPage(x, details.modules[currentPage].type),
          isHighlight: x === 0,
          locked: details?.modules[x].locked,
          pageState: {
            currentPage: x,
            isDrawerOpen: true,
            pageTitle: details?.modules[x].title,
          },
        };
        arr.push(buttonObject);
      }
    }
    return arr;
  }, [changeDrawerPage, id, context, details, currentPage]);

  const renderDrawerPage = useCallback(() => {
    if (details) {
      let moduleType: string | undefined = details?.modules[currentPage]?.type;
      switch (moduleType) {
        case "CUSTOM_MODULE":
          return (
            <CustomDrawer
              drawerData={details?.modules[currentPage]?.moduleInfo}
            />
          );
        case "WARRANTY_MODULE":
          return (
            <WarrantyDrawer
              closePage={closeDrawerPage}
              warrantyActivated={false}
              warrantyData={details?.modules[currentPage]?.moduleInfo}
            />
          );
        case "LINK_MODULE":
          return (
            <LinkModule
              closePage={closeDrawerPage}
              moduleData={details?.modules[currentPage]?.moduleInfo}
            />
          );
        default:
          return null;
      }
    }
  }, [currentPage, closeDrawerPage, details]);

  const logo = useCallback(
    (image: string) => <Image src={image} alt="brand-logo" maxWidth="110px" />,
    []
  );

  const handleOpenMenuClicked = useCallback(
    () => context.setIsMenuOpen(true),
    [context]
  );

  const menuButton = useMemo(
    () => (
      <Wrapper width="100%" justifyContent="flex-end">
        <IconButton
          theme="dark"
          iconName="menu"
          onClick={handleOpenMenuClicked}
        />
      </Wrapper>
    ),
    [handleOpenMenuClicked]
  );

  // useEffect(() => {
  //   if(context?.pageState !== null) {
  //     setCurrentPage(context?.pageState?.currentPage);
  //     setIsDrawerPageOpen(context?.pageState?.isDrawerOpen);
  //     setPageTitle(context?.pageState?.pageTitle);
  //     context.setPageState(null);
  //   }
  // }, [context?.pageState, context])

  return (
    <>
      {!details ? (
        <LoadingIndicator />
      ) : (
        <>
          <Wrapper
            width="100%"
            height="100%"
            direction="column"
            justifyContent="space-between"
            overflow="auto"
          >
            <PageHeader
              logo={logo(details?.brand?.image ?? "")}
              actionButton={menuButton}
              border={false}
            />
            <Wrapper
              width="100%"
              height="100%"
              justifyContent="center"
              alignItems="flex-start"
              padding="2rem 1rem"
              responsiveImg
            >
              <Image src={details?.product?.image} alt="product" />
            </Wrapper>
          </Wrapper>
          <BottomDrawer
            title={pageTitle}
            buttons={buttonsArray}
            socials={details?.brand?.social}
            isChildOpen={isDrawerPageOpen}
            closeChild={closeDrawerPage}
          >
            {renderDrawerPage()}
          </BottomDrawer>
        </>
      )}
    </>
  );
};

export default ProductDetails;
