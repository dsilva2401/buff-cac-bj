import React, { useCallback, useMemo } from 'react';
import { useGlobal } from 'context/global/GlobalContext';
import { Redirect, Route, RouteProps, useRouteMatch } from 'react-router-dom';
import LoadingIndicator from 'components/LoadingIndicator';
import Wrapper from 'components/Wrapper';
import { RoutesHashMap } from 'routes';

interface totalSteps {
  totalSteps: number;
}
export interface FormMatchParams {
  id: string;
  stepId: string;
}

const ProtectedRoute: React.FC<totalSteps & RouteProps> = (props) => {
  const { productDetails } = useGlobal();
  const { params } = useRouteMatch<FormMatchParams>();

  const loadingIndicator = useMemo(
    () => (
      <Wrapper height='100vh' padding='5rem 0 0 0'>
        <LoadingIndicator />
      </Wrapper>
    ),
    []
  );

  const checkForFormModule = useCallback((): boolean => {
    // TODO step id isn't present here so let's get it and make sure we don't go over steps.
    // if (parseInt(params.stepId, 10) <= props.totalSteps) {
    // }
    return true;
  }, [productDetails]);

  if (checkForFormModule()) {
    return <Route {...props} />;
  }
  return <Redirect to={RoutesHashMap.FourZeroFour.path} />;
};

export default ProtectedRoute;
