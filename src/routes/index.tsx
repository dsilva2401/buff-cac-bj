import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Route, Switch, useLocation } from 'react-router-dom';
import ProtectedRoute from 'components/ProtectedRoute';
import ProductDetails from 'pages/ProductDetails';
import PageWrapper from 'components/PageWrapper';
import Profile from 'pages/Profile/Profile';
import Collection from 'pages/Collection';
import MagicLink from 'pages/MagicLink';
import Viscosoft from 'pages/Viscosoft';
import FourZeroFour from 'pages/404';
import Login from 'pages/Login';
import {
  withLastLocation,
  WithLastLocationProps,
} from 'react-router-last-location';
import './style.css';
interface RoutesType {
  [key: string]: any;
}

export const RoutesHashMap: RoutesType = {
  Login: {
    path: '/',
    component: <Login />,
  },
  Collection: {
    path: '/app/collection',
    component: <Collection />,
    protected: true,
  },
  Profile: {
    path: '/app/profile',
    component: <Profile />,
    protected: true,
  },
  ProductDetails: {
    path: (id: string = ':id') => `/c/${id}`,
    component: <ProductDetails />,
  },
  MagicLink: {
    path: '/magic-link',
    component: <MagicLink />,
  },
  ViscoSoft: {
    path: '/app/l/viscosoft',
    component: <Viscosoft />,
  },
};

const getTransition = (path: string, lastLocation: string) => {
  switch (path) {
    case '/':
      return 'inverseslide';
    case '/signup':
      return 'slide';
    case '/forgot-password':
      return 'slide';
    case '/app/collection':
      return lastLocation === null || lastLocation === '/'
        ? 'slide'
        : 'inverseslide';
    case '/app/profile':
      return lastLocation === '/app/collection' ? 'slide' : 'inverseslide';
    default:
      return 'slide';
  }
};

const Routes: React.FC<WithLastLocationProps> = ({ lastLocation }) => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        timeout={300}
        key={location.key}
        classNames={getTransition(
          location.pathname,
          lastLocation ? lastLocation?.pathname : ''
        )}
      >
        <Switch location={location}>
          {Object.keys(RoutesHashMap).map((routeKey) => {
            const routeObject = RoutesHashMap[routeKey];
            const path =
              typeof RoutesHashMap[routeKey].path === 'function'
                ? RoutesHashMap[routeKey].path()
                : RoutesHashMap[routeKey].path;
            if (routeObject.protected) {
              return (
                <ProtectedRoute exact path={path} key={routeKey}>
                  <PageWrapper>{routeObject.component}</PageWrapper>
                </ProtectedRoute>
              );
            }
            return (
              <Route exact path={path} key={routeKey}>
                <PageWrapper>{routeObject.component}</PageWrapper>
              </Route>
            );
          })}
          <Route>
            <PageWrapper>
              <FourZeroFour />
            </PageWrapper>
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withLastLocation(Routes);
