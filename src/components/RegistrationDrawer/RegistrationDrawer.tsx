import React, { useState, useEffect, useCallback } from "react";
import Text from "components/Text";
import Input from "components/Input";
import Image from "components/Image";
import Button from "components/Button";
import Wrapper from "components/Wrapper";
import SuccessDrawer from "components/SuccessDrawer";
import registerBanner from "assets/images/png/register-warranty.png";
import { Redirect } from "react-router";
import { useTranslation } from "react-i18next";
import { ReactComponent as Mail } from "assets/icons/svg/mail.svg";
import { ReactComponent as GoogleLogo } from "assets/logos/svg/google.svg";
import { ReactComponent as FacebookLogo } from "assets/logos/svg/facebook.svg";

type RegistrationDrawerProps = {
  isAuthenticated: boolean;
  registrationData: any;
  closePage(): void;
};

const RegistrationDrawer: React.FC<RegistrationDrawerProps> = ({
  registrationData,
  isAuthenticated,
  closePage,
}) => {
  const [successDrawer, setSuccessDrawer] = useState(isAuthenticated);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { t } = useTranslation("translation", {
    keyPrefix: "drawers.registrationDrawer",
  });

  const confirmRegistration = () => {
    setSuccessDrawer(true);
  };

  const closeSuccess = useCallback(() => {
    setSuccessDrawer(false);
    closePage();
  }, [closePage]);

  useEffect(() => {
    if (successDrawer) {
      setTimeout(() => {
        setSuccessDrawer(false);
        closePage();
      }, 3000);
    }
  }, [successDrawer, registrationData, closePage]);

  return isAuthenticated && !successDrawer && registrationData?.nextLink ? (
    <Redirect to={registrationData?.nextLink} />
  ) : isAuthenticated ? (
    <SuccessDrawer
      isOpen={successDrawer}
      title={t("successDrawer.title")}
      description={t("successDrawer.description")}
      close={closeSuccess}
    />
  ) : (
    <>
      <SuccessDrawer
        isOpen={successDrawer}
        title={t("successDrawer.title")}
        description={t("successDrawer.description")}
        close={closeSuccess}
      />
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
              <p>{registrationData?.heading}</p>
            </Text>
            <p>{registrationData?.description}</p>
          </Text>
        </Wrapper>
        <Wrapper width="100%" direction="column">
          <Wrapper width="100%" direction="column" gap="1rem">
            <Text fontSize="0.7rem" color="#1b1b1b" padding="0 0.5rem">
              <p>{t("signInDisclaimer")}</p>
            </Text>
            <Wrapper width="100%" direction="column" gap="1rem">
              <Button theme="light" onClick={() => setSuccessDrawer(true)}>
                <GoogleLogo /> {t("googleButton")}
              </Button>
              <Button theme="light" onClick={() => setSuccessDrawer(true)}>
                <FacebookLogo /> {t("googleButton")}
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
              onChange={({ target: { value } }) => setEmail(value)}
              margin="0 0 1rem"
            />
            <Input
              type="password"
              value={password}
              placeholder={t("passwordInput")}
              onChange={({ target: { value } }) => setPassword(value)}
              margin="0 0 1rem"
            />
            <Button
              theme="light"
              onClick={() => confirmRegistration()}
              disabled={!email || !password}
            >
              <Mail /> {t("signinButton")}
            </Button>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </>
  );
};

export default RegistrationDrawer;
