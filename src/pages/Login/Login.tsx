import brijLogo from "assets/logos/svg/brij-colored.svg";
import Image from "components/Image";
import PageFooter from "components/PageFooter";
import PageHeader from "components/PageHeader";
import Wrapper from "components/Wrapper";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LoginForm from "components/LoginForm";
import useRedirectLoggedInUser from "hooks/useRedirectLoggedInUser";
import { useGlobal } from "context/global/GlobalContext";
import IconButton from "components/IconButton";

const Login: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "signIn" });
  const { user, setIsMenuOpen } = useGlobal();

  const logo = useMemo(
    () => <Image width="auto" src={brijLogo} alt="Brij logo" />,
    []
  );

  const menuButton = useMemo(
    () => (
      <Wrapper width="100%" justifyContent="flex-end">
        <IconButton theme="dark" iconName="menu" onClick={() => setIsMenuOpen(true)} />
      </Wrapper>
    ),
    [setIsMenuOpen]
  );

  useRedirectLoggedInUser(user);

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      overflow='auto'
    >
      <PageHeader border title={t("pageHeaderTitle")} logo={logo} actionButton={menuButton} />
      <LoginForm />
      <PageFooter>
        <p>{t("newToBrij")}?</p>
        <Link to={"/signup"}>{t("signUpLink")}</Link>
      </PageFooter>
    </Wrapper>
  );
};

export default Login;
