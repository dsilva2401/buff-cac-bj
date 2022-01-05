import FourZeroFour from 'pages/404';
import Collection from 'pages/Collection';
import ForgotPassword from 'pages/ForgotPassword';
import Login from 'pages/Login';
import MagicLink from 'pages/MagicLink';
import PersonalDetails from 'pages/PersonalDetails';
import ProductDetails from 'pages/ProductDetails';
import Profile from 'pages/Profile/Profile';
import ResetPassword from 'pages/ResetPassword';
import SignUp from 'pages/SignUp';
import { Route, Switch } from 'react-router-dom';

export default function Routes() {
  return (
    <Switch>
      <Route exact path={'/'} component={Login} />
      <Route exact path={'/app/signup'} component={SignUp} />
      <Route exact path={'/app/forgot-password'} component={ForgotPassword} />
      <Route exact path={'/app/collection'} component={Collection} />
      <Route exact path={'/app/profile'} component={Profile} />
      <Route exact path={'/app/reset-password'} component={ResetPassword} />
      <Route exact path={'/c/:id'} component={ProductDetails} />
      <Route exact path={'/app/magic-link'} component={MagicLink} />
      <Route exact path={'/app/personal-details'} component={PersonalDetails} />
      <Route component={FourZeroFour} />
    </Switch>
  );
}
