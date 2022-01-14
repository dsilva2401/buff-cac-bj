import { Route, Switch, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ProtectedRoute from 'components/ProtectedRoute';
import ForgotPassword from 'pages/ForgotPassword';
import ProductDetails from 'pages/ProductDetails';
import PageWrapper from 'components/PageWrapper';
import Profile from 'pages/Profile/Profile';
import Collection from 'pages/Collection';
import MagicLink from 'pages/MagicLink';
import FourZeroFour from 'pages/404';
import SignUp from 'pages/SignUp';
import Login from 'pages/Login';
import './style.css';

interface RoutesType {
  [key: string]: any;
};

export const RoutesHashMap: RoutesType = {
  Login: {
    path: '/',
    component: <Login />,
  },
  Signup: {
    path: '/signup',
    component: <SignUp />,
  },
  ForgotPassword: {
    path: '/forgot-password',
    component: <ForgotPassword />,
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
    path: (id: string = ":id") => `/c/${id}`,
    component: <ProductDetails />,
  },
  MagicLink: {
    path: '/magic-link',
    component: <MagicLink />,
  },
};

const getTransition = (path: string) => {
  switch (path) {
    case '/': return 'inverseslide';
    case '/signup': return 'slide';
    case '/forgot-password': return 'slide';
    case '/app/collection': return 'inverseslide';
    case '/app/profile': return 'inverseslide';
    default: return 'slide';
  };
};

export default function Routes() {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        timeout={500}
        classNames={getTransition(location.pathname)}
        key={location.key}
      >
        <Switch location={location}>
          {Object.keys(RoutesHashMap)
            .map(
              routeKey => {
                const routeObject = RoutesHashMap[routeKey];
                const path = (
                  typeof RoutesHashMap[routeKey].path === 'function'
                    ? RoutesHashMap[routeKey].path()
                    : RoutesHashMap[routeKey].path
                )
                if (routeObject.protected) {
                  return (
                    <ProtectedRoute
                      exact
                      path={path}
                      key={routeKey}
                    >
                      <PageWrapper>
                        {routeObject.component}
                      </PageWrapper>
                    </ProtectedRoute>
                  )
                }
                return (
                  <Route
                    exact
                    path={path}
                    key={routeKey}
                  >
                    <PageWrapper>
                      {routeObject.component}
                    </PageWrapper>
                  </Route>
                )
              }
            )
          }
          <Route>
            <PageWrapper>
              <FourZeroFour />
            </PageWrapper>
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup >
  );
};
