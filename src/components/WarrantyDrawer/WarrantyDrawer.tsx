import React, { useCallback, useEffect, useState } from "react";
import { ReactComponent as Info } from "assets/icons/svg/info-outline.svg";
import { WarrantyModuleType } from "../../types/ProductDetailsType";
import { useGlobal } from "../../context/global/GlobalContext";
import { useTranslation } from "react-i18next";
import LoadingIndicator from "components/LoadingIndicator";
import SuccessDrawer from "components/SuccessDrawer";
import DetailsModal from "./DetailsModal";
import Wrapper from "components/Wrapper";
import Text from "components/Text";

type WarrantyDrawerProps = {
  closePage(): void;
  warrantyId: string;
  warrantyData: WarrantyModuleType;
};

const WarrantyDrawer: React.FC<WarrantyDrawerProps> = ({
  closePage,
  warrantyData,
  warrantyId,
}) => {
  const [successDrawer, setSuccessDrawer] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const { loading, activateWarranty, getProductDetails } = useGlobal();

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
    const checkAndActivateWarranty = async () => {
      // await activateWarranty(warrantyId);

        // let myHeaders = new Headers();
        // myHeaders.append("Authorization", `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1NmMwNDEwZmE1MjFjMTZlNDQ2NWE4ZjVjODU5NjZhNWY1MDk5NGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYnJpai1jb25zdW1lci1hcHAiLCJhdWQiOiJicmlqLWNvbnN1bWVyLWFwcCIsImF1dGhfdGltZSI6MTYzOTY0NTU4NywidXNlcl9pZCI6Ims4dTVMeUxHWHhNN3QzZTBYclp3anNRUnpRejIiLCJzdWIiOiJrOHU1THlMR1h4TTd0M2UwWHJad2pzUVJ6UXoyIiwiaWF0IjoxNjM5NjQ1NTg3LCJleHAiOjE2Mzk2NDkxODcsImVtYWlsIjoiYXJxYW10ZXN0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhcnFhbXRlc3RAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.lxUlObBCUm8BJwcJhGA3A4eRax8bk8tHy_C7VvsLaOWb4mA8G20kUuJRVQDBsIfsv0IYqUBycYU0j2tsuu1sGysZO2ahFpmm8c0D176_bnQOGPKNyvDOp5vd1s1hsnHzB7KQlkfjddPetypy-iIrWgT5yl4SfmMEpJg-M8DFPCd8sVEEKwvgPh2lE_VxVK4W-TNDuoE8ho9kIrarAuOqTdpr6rp8i7RWm_6WBCAJ5h70wqzWMCvpQV1Cqpa97jJbC5pxZSa5_bwSu3NRkivHZnjJ6WxC-z0958KValIoJ1-Soh-bsskxiybyeKMKB1MkGjlBiqv1hH78-p9SJUQ_Cg`);
        // myHeaders.append("Content-Type", "application/json");
        
        // let raw = JSON.stringify({
        //   "warrantyId": `${warrantyId}`
        // });
  
        // fetch("https://damp-wave-40564.herokuapp.com/products/activateWarranty", {
        //   method: 'POST',
        //   headers: myHeaders,
        //   body: raw,
        //   redirect: 'follow'
        // })
        //   .then(response => response.text())
        //   .then(result => console.log(result))
        //   .catch(error => console.log('error', error));

        //   getProductDetails("0SVJ", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1NmMwNDEwZmE1MjFjMTZlNDQ2NWE4ZjVjODU5NjZhNWY1MDk5NGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYnJpai1jb25zdW1lci1hcHAiLCJhdWQiOiJicmlqLWNvbnN1bWVyLWFwcCIsImF1dGhfdGltZSI6MTYzOTY0NTU4NywidXNlcl9pZCI6Ims4dTVMeUxHWHhNN3QzZTBYclp3anNRUnpRejIiLCJzdWIiOiJrOHU1THlMR1h4TTd0M2UwWHJad2pzUVJ6UXoyIiwiaWF0IjoxNjM5NjQ1NTg3LCJleHAiOjE2Mzk2NDkxODcsImVtYWlsIjoiYXJxYW10ZXN0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhcnFhbXRlc3RAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.lxUlObBCUm8BJwcJhGA3A4eRax8bk8tHy_C7VvsLaOWb4mA8G20kUuJRVQDBsIfsv0IYqUBycYU0j2tsuu1sGysZO2ahFpmm8c0D176_bnQOGPKNyvDOp5vd1s1hsnHzB7KQlkfjddPetypy-iIrWgT5yl4SfmMEpJg-M8DFPCd8sVEEKwvgPh2lE_VxVK4W-TNDuoE8ho9kIrarAuOqTdpr6rp8i7RWm_6WBCAJ5h70wqzWMCvpQV1Cqpa97jJbC5pxZSa5_bwSu3NRkivHZnjJ6WxC-z0958KValIoJ1-Soh-bsskxiybyeKMKB1MkGjlBiqv1hH78-p9SJUQ_Cg");

      setSuccessDrawer(true);
      
    };
    if (!warrantyData?.activated) {
      checkAndActivateWarranty();
    }
  }, [warrantyData, warrantyId, activateWarranty, getProductDetails]);

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
        title={t("successDrawer.title")}
        description={t("successDrawer.description")}
        close={closeSuccess}
      />
      <DetailsModal
        isOpen={isDetailsOpen}
        close={closeDetails}
        warrantyActivated={warrantyData?.activated}
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
                      {warrantyData?.period} {warrantyData?.duration?.label}
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
                    <p>
                      {warrantyData?.activated ? "Activated" : "Not Activated"}
                    </p>
                  </Text>
                </Wrapper>
                <Wrapper width="10%" alignItems="center"></Wrapper>
              </Wrapper>
              {warrantyData?.activated && (
                <>
                  <Wrapper width="100%">
                    <Wrapper width="45%" alignItems="center">
                      <Text fontSize="0.8rem" color="#1b1b1b">
                        <p>{t("purchaseDate")}</p>
                      </Text>
                    </Wrapper>
                    <Wrapper width="45%" alignItems="center">
                      <Text fontSize="0.8rem" color="#1b1b1b" fontWeight="700">
                        <p>{warrantyData?.purchaseDate?.substr(0, 10)}</p>
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
                        <p>{warrantyData?.expirationDate?.substr(0, 10)}</p>
                      </Text>
                    </Wrapper>
                    {/* <Wrapper width="10%" alignItems="center"></Wrapper> */}
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
