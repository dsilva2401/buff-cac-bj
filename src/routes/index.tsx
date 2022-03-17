import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import ProtectedRoute from 'components/ProtectedRoute';
import ProductDetails from 'pages/ProductDetails';
import PageWrapper from 'components/PageWrapper';
import Profile from 'pages/Profile/Profile';
import Collection from 'pages/Collection';
import MagicLink from 'pages/MagicLink';
import FourZeroFour from 'pages/404';
import Landing from 'pages/Landing';
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
    path: '/app/login',
    component: <Login />,
  },
  MagicLink: {
    path: '/app/magic-link',
    component: <MagicLink />,
  },
  FourZeroFour: {
    path: '/app/404',
    component: <FourZeroFour />,
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
  Landing: {
    path: '/app/l/:brandname',
    component: <Landing />,
  },
};

const getTransition = (path: string, lastLocation: string) => {
  switch (path) {
    case '/app/login':
      return 'inverseslide';
    case '/app/collection':
      return lastLocation === null || lastLocation === '/app/login'
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
              {location?.pathname === '/' ? (
                <Redirect to='/app/login' />
              ) : (
                <Redirect to='/app/404' />
              )}
            </PageWrapper>
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withLastLocation(Routes);
