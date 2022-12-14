import React, { useMemo } from 'react';
import { RoutesHashMap } from 'routes';
import { useGlobal } from 'context/global/GlobalContext';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import LoadingIndicator from 'components/LoadingIndicator';
import Wrapper from 'components/Wrapper';

const ProtectedRoute: React.FC<RouteProps> = (props) => {
  const { user, authFetched } = useGlobal();

  const loadingIndicator = useMemo(
    () => (
      <Wrapper height='100vh' padding='5rem 0 0 0'>
        <LoadingIndicator />
      </Wrapper>
    ),
    []
  );

  if (!authFetched) {
    return loadingIndicator;
  }

  if (user) {
    return <Route {...props} />;
  }

  return <Redirect to={RoutesHashMap.Login.path} />;
};

export default ProtectedRoute;
