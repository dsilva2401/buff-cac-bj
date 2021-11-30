import React from "react";
import { useHistory } from "react-router";
import PageHeader from "components/PageHeader";
import Wrapper from "components/Wrapper";
import Button from "components/Button";
import Input from "components/Input";

const ResetPassword: React.FC = () => {
  const history = useHistory();

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      overflow="auto"
    >
      <PageHeader
        title="Reset Password"
        goBack={() => history.push("/profile")}
      />
      <Wrapper
        width="100%"
        height="100%"
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        gap="1rem"
        padding="2rem 1rem 0"
      >
        <Input type="password" placeholder="Current password..." />
        <Input type="password" placeholder="New password..." />
        <Input type="password" placeholder="Re-enter new password..." />
      </Wrapper>
      <Wrapper
        width="100%"
        justifyContent="center"
        alignItems="center"
        padding="1rem"
      >
        <Button theme="dark" onClick={() => history.push("/profile")}>
          Reset
        </Button>
      </Wrapper>
    </Wrapper>
  );
};

export default ResetPassword;
