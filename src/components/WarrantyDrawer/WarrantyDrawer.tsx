import React, { useCallback, useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
} from "@firebase/auth";
import SuccessDrawer from "components/SuccessDrawer";
import Wrapper from "components/Wrapper";
import Image from "components/Image";
import Text from "components/Text";
import Button from "components/Button";
import DetailsModal from "./DetailsModal";
import { ReactComponent as Info } from "assets/icons/svg/info-outline.svg";
import { ReactComponent as GoogleLogo } from "assets/logos/svg/google.svg";
import { ReactComponent as FacebookLogo } from "assets/logos/svg/facebook.svg";
import { ReactComponent as Mail } from "assets/icons/svg/mail.svg";
import registerBanner from "assets/images/png/register-warranty.png";
import { useTranslation } from "react-i18next";
import Input from "components/Input";

type WarrantyDrawerProps = {
  isAuthenticated: boolean | undefined;
  warrantyActivated?: boolean;
  closePage(): void;
  warrantyData: any;
};

const WarrantyDrawer: React.FC<WarrantyDrawerProps> = ({
  isAuthenticated,
  warrantyActivated,
  closePage,
  warrantyData,
}) => {
  const [successDrawer, setSuccessDrawer] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [email, setEmail] = React.useState(
    window.localStorage.getItem("emailForSignIn") || ""
  );
  const [errorResponse, setErrorResponse] = React.useState("");
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

  const handleGoogleAuth = useCallback(() => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => console.log("SIGNIN RESULT: ", result))
      .catch((error) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR MSG: ", error.message);
      });
  }, [auth]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const token = await user?.getIdToken();
  //     setToken(token);
  //   }
  //   if (user) fetchData();
  // }, [user]);

  // useEffect(() => {
  //   if (token) {
  //     let myHeaders = new Headers();
  //     myHeaders.append("Authorization", `Bearer ${token}`);
  //     myHeaders.append("Content-Type", "application/json");

  //     console.log("GOOGLE USER OBJECT: ", user);

  //     let raw = JSON.stringify({
  //       email: user?.email,
  //       phoneNumber: user?.phoneNumber,
  //       firstName: user?.displayName,
  //       lastName: "",
  //     });

  //     fetch("https://damp-wave-40564.herokuapp.com/auth", {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: "follow",
  //     })
  //       .then((response) => {
  //         if (response.status === 200) {
  //           history.push("/collection");
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("ERROR CODE: ", error.code);
  //         console.log("ERROR MSG: ", error.message);
  //       });
  //     setLoading(false);
  //   }
  // }, [user, token, history]);

  useEffect(() => {
    if (successDrawer) {
      setTimeout(() => {
        setIsDetailsOpen(false);
      }, 1000);
      setTimeout(() => {
        setSuccessDrawer(false);
        closePage();
      }, 3000);
    }
  }, [successDrawer, closePage]);

  const clearError = () => {
    if (errorResponse !== "") {
      setErrorResponse("");
    }
  };

  useEffect(() => {
    const savedEmail = window.localStorage.getItem("emailForSignIn");
    if (isSignInWithEmailLink(auth, window.location.href) && !!savedEmail) {
      signInWithEmailLink(auth, savedEmail, window.location.href);
    }
  }, [auth]);

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setEmail(e.target.value);
  };

  const handleEmailSignIn = async () => {
    if (isSignInWithEmailLink(auth, window.location.href) && !!email) {
      signInWithEmailLink(auth, email, window.location.href).catch((err) => {
        switch (err.code) {
          default:
            setErrorResponse("An unknown error has occured");
        }
      });
    } else {
      sendSignInLinkToEmail(auth, email, {
        url: "http://localhost:3000/product/3xpm",
        handleCodeInApp: true,
      })
        .then(() => {
          window.localStorage.setItem("emailForSignIn", email);
        })
        .catch((err) => {
          switch (err.code) {
            default:
              setErrorResponse("An unknown error has occured");
          }
        });
    }
  };

  console.log("IS AUTHENTICATED: ", isAuthenticated);
  console.log("WARRANTY ACTIVATED: ", warrantyActivated);

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
        {isAuthenticated ? (
          <>
            <Wrapper width="100%" padding="1rem 1rem 0.5rem">
              <Text fontSize="0.88rem" color="#98A3AA">
                <p>{warrantyData?.warrantyStatus?.details}</p>
              </Text>
            </Wrapper>
            <Wrapper
              width="100%"
              direction="column"
              padding="1rem"
              gap="0.3rem"
              margin="0 0 0.5rem"
            >
              <Text fontSize="0.8rem" color="#98A3AA">
                <p>{t("details")}</p>
              </Text>
              <Wrapper width="100%" direction="column" gap="0.5rem">
                <Wrapper width="100%" alignItems="center">
                  <Wrapper width="45%" alignItems="center">
                    <Text fontSize="0.8rem" color="#1b1b1b">
                      <p>{t("duration")}</p>
                    </Text>
                  </Wrapper>
                  <Wrapper width="45%" alignItems="center">
                    <Text fontSize="0.8rem" color="#1b1b1b" fontWeight="700">
                      <p>{warrantyData.warrantyStatus.duration}</p>
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
                        <Text
                          fontSize="0.8rem"
                          color="#1b1b1b"
                          fontWeight="700"
                        >
                          <p>{warrantyData?.warrantyStatus?.purchaseDate}</p>
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
                        <Text
                          fontSize="0.8rem"
                          color="#1b1b1b"
                          fontWeight="700"
                        >
                          <p>{warrantyData?.warrantyStatus?.expirationDate}</p>
                        </Text>
                      </Wrapper>
                      <Wrapper width="10%" alignItems="center"></Wrapper>
                    </Wrapper>
                  </>
                )}
              </Wrapper>
            </Wrapper>
            <Wrapper width="100%">
              <Button
                theme={warrantyActivated ? "light" : "dark"}
                onClick={() =>
                  warrantyActivated
                    ? setIsDetailsOpen(true)
                    : setSuccessDrawer(true)
                }
              >
                {warrantyActivated
                  ? t("changePurchaseDetails")
                  : t("activateDetails")}
              </Button>
            </Wrapper>
          </>
        ) : (
          <Wrapper width="100%" direction="column" padding="0 0.5rem">
            <Wrapper
              width="100%"
              position="relative"
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              margin="0 0 2rem"
              gap="1rem"
              after={{
                content: " ",
                position: "absolute",
                bottom: "-1rem",
                height: "1px",
                width: "100%",
                background: "#CBD1D4",
              }}
              responsiveImg
            >
              <Image src={registerBanner} alt="Register Banner" rounded />
              <Text
                fontSize="0.8rem"
                color="#1b1b1b"
                padding="0 0.5rem"
                textAlign="left"
              >
                <Text
                  fontSize="0.8rem"
                  color="#98A3AA"
                  padding="0 0.5rem"
                  textAlign="left"
                  fontWeight="700"
                >
                  <p>{warrantyData.heading}</p>
                </Text>
                <p>{warrantyData.description}</p>
              </Text>
            </Wrapper>
            <Wrapper width="100%" direction="column">
              <Wrapper width="100%" direction="column" gap="1rem">
                <Text fontSize="0.7rem" color="#1b1b1b" padding="0 0.5rem">
                  <p>{t("signInDisclaimer")}</p>
                </Text>
                <Wrapper width="100%" direction="column" gap="1rem">
                  <Button theme="light" onClick={handleGoogleAuth}>
                    <GoogleLogo /> {t("googleButton")}
                  </Button>
                  <Button theme="light">
                    <FacebookLogo /> {t("facebookButton")}
                  </Button>
                </Wrapper>
              </Wrapper>
            </Wrapper>
            <Wrapper width="100%" direction="column" padding="0 0 1rem">
              <Wrapper width="100%" justifyContent="center" margin="1rem 0">
                <Text fontSize="1.2rem" color="#98A3AA">
                  <p>or</p>
                </Text>
              </Wrapper>
              <Wrapper width="100%" direction="column">
                <Input
                  type="text"
                  value={email}
                  placeholder={t("emailInput")}
                  onChange={updateEmail}
                  margin="0 0 1rem"
                />
                <Button
                  theme="light"
                  onClick={handleEmailSignIn}
                  disabled={
                    !email ||
                    !email.includes(".com") ||
                    !email.includes("@") ||
                    email.length < 6
                  }
                >
                  <Mail />
                  {t("registerButton")}
                </Button>
              </Wrapper>
            </Wrapper>
          </Wrapper>
        )}
      </Wrapper>
    </>
  );
};

export default WarrantyDrawer;
