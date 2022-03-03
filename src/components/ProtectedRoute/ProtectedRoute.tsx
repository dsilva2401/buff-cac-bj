import React from 'react';
import { RoutesHashMap } from 'routes';
import { useGlobal } from 'context/global/GlobalContext';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import LoadingIndicator from 'components/LoadingIndicator';
import Wrapper from 'components/Wrapper';

const ProtectedRoute: React.FC<RouteProps> = (props) => {
  const { user, authFetched } = useGlobal();

  if (!authFetched) {
    return (
      <Wrapper height='100vh' paddingTop='5rem'>
        <LoadingIndicator />
      </Wrapper>
    );
  }
  if (user) {
    return <Route {...props} />;
  }

  return <Redirect to={RoutesHashMap.Login.Path} />;
};

export default ProtectedRoute;
