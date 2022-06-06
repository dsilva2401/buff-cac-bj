import React, { useCallback, useMemo } from 'react';
import { useGlobal } from 'context/global/GlobalContext';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import LoadingIndicator from 'components/LoadingIndicator';
import Wrapper from 'components/Wrapper';
import { RoutesHashMap } from 'routes';

const ProtectedRoute: React.FC<RouteProps> = (props) => {
  const { productDetails } = useGlobal();

  const loadingIndicator = useMemo(
    () => (
      <Wrapper height='100vh' padding='5rem 0 0 0'>
        <LoadingIndicator />
      </Wrapper>
    ),
    []
  );

  const checkForFormModule = useCallback((): boolean => {
    // if (productDetails) {
    //     // check if form module is enabled.
    //     return false;
    // } else {
    //     return false;
    // }
    return true;
  }, [productDetails]);

  if (checkForFormModule()) {
    return <Route {...props} />;
  }
  return <Redirect to={RoutesHashMap.FourZeroFour.path} />;
};

export default ProtectedRoute;
