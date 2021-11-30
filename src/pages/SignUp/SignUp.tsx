import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import PageHeader from "components/PageHeader";
import PageFooter from "components/PageFooter";
import Wrapper from "components/Wrapper";
import Button from "components/Button";
import Input from "components/Input";
import Image from "components/Image";
import Text from "components/Text";
import brijLogo from "assets/logos/svg/brij-colored.svg";
import LoadingIndicator from "components/LoadingIndicator";
import { ReactComponent as GoogleLogo } from "assets/logos/svg/google.svg";
import { ReactComponent as FacebookLogo } from "assets/logos/svg/facebook.svg";

const SignUp: React.FC = () => {
  const history = useHistory();
  const auth = getAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const logo = <Image width="auto" src={brijLogo} alt="Brij logo" />;

  // const validateLogin = () => {
  //   if (email && password) {
  //     history.push("/collection");
  //   }
  // };

  const signUpWithEmailAndPassword = () => {
    setLoading(true);
    if (error !== "") setError("");
    createUserWithEmailAndPassword(auth, email, password)
      .then((result: any) => {
        console.log(result);
        history.push("/collection");
      })
      .catch((error: any) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR CODE: ", error.message);

        if (error.code.includes("auth/weak-password")) {
          setError("Please enter a stronger password.");
        } else if (error.code.includes("auth/email-already-in-use")) {
          setError("Email already in use.");
        } else {
          setError("Unable to register. Please try again later.");
        }
        setLoading(false);
      });
  };

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <PageHeader border title="Sign Up" logo={logo} />
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
          width="100%"
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap="1rem"
        >
          <Button theme="light" onClick={() => history.push("/collection")}>
            <GoogleLogo /> Continue with Google
          </Button>
          <Button theme="light" onClick={() => history.push("/collection")}>
            <FacebookLogo /> Continue with Facebook
          </Button>
        </Wrapper>

        <Wrapper justifyContent="center" alignItems="center">
          <Text fontSize="1.2rem" color="#98A3AA">
            <p>or</p>
          </Text>
        </Wrapper>

        <Wrapper
          direction="column"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Input
            type="text"
            value={email}
            placeholder="Enter email..."
            onChange={({ target: { value } }) => setEmail(value)}
            margin="0 0 1rem"
          />
          <Input
            type="password"
            value={password}
            placeholder="Enter password..."
            onChange={({ target: { value } }) => setPassword(value)}
          />
        </Wrapper>
        <Wrapper width="100%" justifyContent="center" alignItems="center">
          {loading ? (
            <LoadingIndicator />
          ) : (
            <Button theme="dark" onClick={() => signUpWithEmailAndPassword()}>
              Sign Up
            </Button>
          )}
        </Wrapper>
      </Wrapper>
      <PageFooter>
        <p>Already have a BRIJ account?</p>
        <Link to={"/"}>Sign in!</Link>
      </PageFooter>
    </Wrapper>
  );
};

export default SignUp;
