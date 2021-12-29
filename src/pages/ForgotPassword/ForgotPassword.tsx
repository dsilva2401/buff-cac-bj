import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import PageHeader from "components/PageHeader";
import Wrapper from "components/Wrapper";
import Button from "components/Button";
import Input from "components/Input";

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "forgotPassword" });
  const [emailInput, setEmailInput] = useState<string>("");
  const history = useHistory();

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <PageHeader
        border
        title={t("pageHeaderTitle")}
        goBack={() => history.push("/")}
      />
      <Wrapper
        width="100%"
        height="100%"
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        padding="2rem 1rem"
        gap="1.2rem"
        overflow="auto"
        margin="2rem 0"
      >
        <Wrapper
          direction="column"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Input
            type="text"
            value={emailInput}
            placeholder={t("emailInput")}
            onChange={({ target: { value } }) => setEmailInput(value)}
            margin="0 0 1rem"
          />
        </Wrapper>
      </Wrapper>
      <Wrapper
        width="100%"
        justifyContent="center"
        alignItems="center"
        padding="0 1rem 1.5rem"
      >
        <Button variant="dark">
          <Link to="/">{t("sendEmailLink")}</Link>
        </Button>
      </Wrapper>
    </Wrapper>
  );
};

export default ForgotPassword;
