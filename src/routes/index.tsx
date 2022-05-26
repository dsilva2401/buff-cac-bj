import React, { useCallback } from 'react';
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
import { useGlobal } from '../context/global/GlobalContext';
interface RoutesType {
  [key: string]: any;
}

export const RoutesHashMap: RoutesType = {
  Login: {
    path: '/app/login',
    component: <Login />,
    exact: true,
  },
  MagicLink: {
    path: '/app/magic-link',
    component: <MagicLink />,
    exact: true,
  },
  FourZeroFour: {
    path: '/app/404',
    component: <FourZeroFour />,
    exact: true,
  },
  Collection: {
    path: '/app/collection',
    component: <Collection />,
    protected: true,
    exact: true,
  },
  Profile: {
    path: '/app/profile',
    component: <Profile />,
    protected: true,
    exact: true,
  },
  ProductDetails: {
    path: '/c/:id',
    component: <ProductDetails />,
    exact: false,
  },
  Landing: {
    path: '/app/l/:brandname',
    component: <Landing />,
    exact: true,
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
  const { isPreviewMode } = useGlobal();

  const getCurrentTransition = useCallback(() => {
    return getTransition(
      location.pathname,
      lastLocation ? lastLocation?.pathname : ''
    );
  }, [location.pathname, lastLocation]);

  const getLocationKey = () => {
    // don't rerender on a nested route.
    if (location.pathname.includes('/c/')) {
      return `products`;
    }
    return location.key;
  };

  return (
    <TransitionGroup>
      <CSSTransition
        timeout={300}
        key={getLocationKey()}
        classNames={getCurrentTransition()}
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
                <ProtectedRoute
                  exact
                  path={path}
                  key={routeKey}
                  render={() => (
                    <PageWrapper isPreviewMode={isPreviewMode}>
                      {routeObject.component}
                    </PageWrapper>
                  )}
                />
              );
            }
            if (location.pathname.includes('form/step')) {
              return (
                <Route
                  exact={routeObject.exact}
                  path={path}
                  key={routeKey}
                  render={() => (
                    <PageWrapper isPreviewMode={isPreviewMode}>
                      <ProductDetails isFormNavigation={true}></ProductDetails>
                    </PageWrapper>
                  )}
                />
              );
            } else {
              return (
                <Route
                  exact={routeObject.exact}
                  path={path}
                  key={routeKey}
                  render={() => (
                    <PageWrapper isPreviewMode={isPreviewMode}>
                      {routeObject.component}
                    </PageWrapper>
                  )}
                />
              );
            }
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
