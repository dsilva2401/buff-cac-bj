import React from 'react';
import { useGlobal } from "context/global/GlobalContext"
import LoadingIndicator from 'components/LoadingIndicator';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { RoutesHashMap } from 'routes';

const ProtectedRoute: React.FC<RouteProps> = (props) => {
  const { user, authFetched } = useGlobal();

  console.log(user, authFetched);

  if (!authFetched) {
    return <LoadingIndicator />
  }

  if (user) {
    return <Route {...props} />
  }

  return <Redirect to={RoutesHashMap.Login.Path} />
}

export default ProtectedRoute
