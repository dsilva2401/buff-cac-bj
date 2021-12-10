import React, { useCallback, useEffect, useState } from "react";
import { ReactComponent as Info } from "assets/icons/svg/info-outline.svg";
import { useTranslation } from "react-i18next";
import { getAuth } from "@firebase/auth";
import Text from "components/Text";
import Wrapper from "components/Wrapper";
import LoadingIndicator from "components/LoadingIndicator";
import SuccessDrawer from "components/SuccessDrawer";
import DetailsModal from "./DetailsModal";

type WarrantyDrawerProps = {
  warrantyActivated?: boolean;
  closePage(): void;
  warrantyData: any;
};

const WarrantyDrawer: React.FC<WarrantyDrawerProps> = ({
  warrantyActivated,
  closePage,
  warrantyData,
}) => {
  const [successDrawer, setSuccessDrawer] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | undefined>("");
  const auth = getAuth();

  const { t } = useTranslation("translation", {
    keyPrefix: "drawers.warrantyDrawer",
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
    async function fetchData() {
      const token = await auth.currentUser?.getIdToken();
      setToken(token);
      console.log("TOKEN: ", token);
    }
    if (auth.currentUser) fetchData();
  }, [auth, token]);

  useEffect(() => {
    if (token && !warrantyActivated) {
      setLoading(true);
      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        warrantyId: "QpaaWnCisQWoZFyRu",
        //make this dynamic
      });

      fetch("https://damp-wave-40564.herokuapp.com/products/activateWarranty", {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      })
        .then((response) => {
          if (response.status === 200) {
            setSuccessDrawer(true);
            setLoading(false);
          }
        })
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    }
  }, [token, warrantyActivated]);

  useEffect(() => {
    if (successDrawer) {
      setTimeout(() => {
        setIsDetailsOpen(false);
      }, 1000);
      setTimeout(() => {
        setSuccessDrawer(false);
      }, 3000);
    }
  }, [successDrawer, closePage]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <SuccessDrawer
        isOpen={successDrawer}
        title={
          warrantyActivated
            ? t("successDrawer.modifiedTitle")
            : t("successDrawer.title")
        }
        description={t("successDrawer.description")}
        close={closeSuccess}
      />
      <DetailsModal
        isOpen={isDetailsOpen}
        close={closeDetails}
        warrantyActivated={warrantyActivated}
        confirmWarranty={confirmWarranty}
      />
      <Wrapper
        width="100%"
        height="100%"
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <>
          <Wrapper
            width="100%"
            gap="0.75rem"
            direction="column"
            padding="0 1rem"
            dangerouslySetInnerHTML={{ __html: warrantyData?.details }}
          />
          <Wrapper
            width="100%"
            direction="column"
            padding="1rem"
            gap="0.3rem"
            margin="0.5rem"
          >
            <Text fontSize="0.8rem" color="#98A3AA">
              <p>{t("details")}</p>
            </Text>
            <Wrapper
              width="100%"
              direction="column"
              gap="0.5rem"
              padding="0 0 1.5rem"
            >
              <Wrapper width="100%" alignItems="center">
                <Wrapper width="45%" alignItems="center">
                  <Text fontSize="0.8rem" color="#1b1b1b">
                    <p>{t("duration")}</p>
                  </Text>
                </Wrapper>
                <Wrapper width="45%" alignItems="center">
                  <Text fontSize="0.8rem" color="#1b1b1b" fontWeight="700">
                    <p>
                      {warrantyData?.period} {warrantyData?.duration}
                    </p>
                  </Text>
                </Wrapper>
                <Wrapper width="10%" alignItems="center">
                  <Info />
                </Wrapper>
              </Wrapper>
              <Wrapper width="100%">
                <Wrapper width="45%" alignItems="center">
                  <Text fontSize="0.8rem" color="#1b1b1b">
                    <p>{t("status")}</p>
                  </Text>
                </Wrapper>
                <Wrapper width="45%" alignItems="center">
                  <Text fontSize="0.8rem" color="#1b1b1b" fontWeight="700">
                    <p>{warrantyActivated ? "Activated" : "Not Activated"}</p>
                  </Text>
                </Wrapper>
                <Wrapper width="10%" alignItems="center"></Wrapper>
              </Wrapper>
              {warrantyActivated && (
                <>
                  <Wrapper width="100%">
                    <Wrapper width="45%" alignItems="center">
                      <Text fontSize="0.8rem" color="#1b1b1b">
                        <p>{t("purchaseDate")}</p>
                      </Text>
                    </Wrapper>
                    <Wrapper width="45%" alignItems="center">
                      <Text fontSize="0.8rem" color="#1b1b1b" fontWeight="700">
                        <p>{warrantyData?.purchaseDate}</p>
                      </Text>
                    </Wrapper>
                    <Wrapper width="10%" alignItems="center"></Wrapper>
                  </Wrapper>
                  <Wrapper width="100%">
                    <Wrapper width="45%" alignItems="center">
                      <Text fontSize="0.8rem" color="#1b1b1b">
                        <p>{t("expires")}</p>
                      </Text>
                    </Wrapper>
                    <Wrapper width="45%" alignItems="center">
                      <Text fontSize="0.8rem" color="#1b1b1b" fontWeight="700">
                        <p>{warrantyData?.expirationDate}</p>
                      </Text>
                    </Wrapper>
                    <Wrapper width="10%" alignItems="center"></Wrapper>
                  </Wrapper>
                </>
              )}
            </Wrapper>
          </Wrapper>
        </>
      </Wrapper>
    </>
  );
};

export default WarrantyDrawer;
