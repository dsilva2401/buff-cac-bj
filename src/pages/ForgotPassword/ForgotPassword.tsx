import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Wrapper from "components/Wrapper";
import PageHeader from "components/PageHeader";
import Button from "components/Button";
import Input from "components/Input";

const ForgotPassword: React.FC = () => {
  const history = useHistory();

  const [emailInput, setEmailInput] = useState<string>("");

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
        title="Forgot Password"
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
            placeholder="Enter email..."
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
        <Button theme="dark">
          <Link to="/">Email me a Link!</Link>
        </Button>
      </Wrapper>
    </Wrapper>
  );
};

export default ForgotPassword;
