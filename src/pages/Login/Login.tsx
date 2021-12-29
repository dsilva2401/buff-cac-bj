import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGlobal } from "context/global/GlobalContext";
import useRedirectLoggedInUser from "hooks/useRedirectLoggedInUser";
import brijLogo from "assets/logos/svg/brij-colored.svg";
import PageFooter from "components/PageFooter";
import PageHeader from "components/PageHeader";
import LoginForm from "components/LoginForm";
import Wrapper from "components/Wrapper";
import Image from "components/Image";

const Login: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "signIn" });
  const { user } = useGlobal();

  const logo = useMemo(
    () => <Image width="auto" src={brijLogo} alt="Brij logo" />,
    []
  );

  useRedirectLoggedInUser(user);

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <PageHeader border title={t("pageHeaderTitle")} logo={logo} />
      <LoginForm />
      <PageFooter>
        <p>{t("newToBrij")}?</p>
        <Link to={"/signup"}>{t("signUpLink")}</Link>
      </PageFooter>
    </Wrapper>
  );
};

export default Login;
