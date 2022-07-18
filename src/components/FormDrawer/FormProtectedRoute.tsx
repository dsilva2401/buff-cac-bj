import React from 'react';
import { Redirect, Route, RouteProps, useParams } from 'react-router-dom';

import { RoutesHashMap } from 'routes';

interface totalSteps {
  totalSteps: number;
}
export interface FormMatchParams {
  id: string;
  stepId: string;
}

const ProtectedRoute: React.FC<totalSteps & RouteProps> = (props) => {
  const checkForFormModule = () => {
    // no easy way to get this url param besides using a wrapper so getting the value here
    const stepId = window.location.pathname.split('/').pop();
    if (stepId === 'start' || 'complete') {
      return true;
    }
    if (stepId) {
      let stepIdInt = parseInt(stepId, 10);
      if (!stepIdInt) {
        return false;
      }
      if (stepIdInt > props.totalSteps) {
        return false;
      } else {
        return true;
      }
    }
  };
  if (checkForFormModule()) {
    return <Route {...props} />;
  }
  return <Redirect to={RoutesHashMap.FourZeroFour.path} />;
};

export default ProtectedRoute;
