import { Route, Switch } from 'react-router-dom';
import ProtectedRoute from 'components/ProtectedRoute';
import ForgotPassword from 'pages/ForgotPassword';
import ProductDetails from 'pages/ProductDetails';
import Profile from 'pages/Profile/Profile';
import Collection from 'pages/Collection';
import MagicLink from 'pages/MagicLink';
import FourZeroFour from 'pages/404';
import SignUp from 'pages/SignUp';
import Login from 'pages/Login';

interface RoutesType {
  [key: string]: any;
};

export const RoutesHashMap: RoutesType = {
  Login: {
    path: '/',
    component: Login
  },
  Signup: {
    path: '/signup',
    component: SignUp
  },
  ForgotPassword: {
    path: '/forgot-password',
    component: ForgotPassword,
  },
  Collection: {
    path: '/app/collection',
    component: Collection,
    protected: true
  },
  Profile: {
    path: '/app/profile',
    component: Profile,
    protected: true
  },
  ProductDetails: {
    path: (id: string = ":id") => `/c/${id}`,
    component: ProductDetails
  },
  MagicLink: {
    path: '/magic-link',
    component: MagicLink
  },
};

export default function Routes() {
  return (
    <Switch>
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
                  component={routeObject.component}
                  key={routeKey}
                />
              )
            }

            return (
              <Route
                exact
                path={path}
                component={routeObject.component}
                key={routeKey}
              />
            )
          }
        )}
      <Route component={FourZeroFour} />
    </Switch>
  );
};
