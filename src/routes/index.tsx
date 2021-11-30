import Collection from 'pages/Collection';
import ForgotPassword from 'pages/ForgotPassword';
import Login from 'pages/Login';
import ProductDetails from 'pages/ProductDetails';
import Profile from 'pages/Profile/Profile';
import ProfileEdit from 'pages/ProfileEdit';
import ResetPassword from 'pages/ResetPassword';
import SignUp from 'pages/SignUp';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

export default function Routes() {
  return (
    <Switch>
      {/* <Route exact path={'/'} component={Login} /> */}
      <Route exact path={'/'} component={ProductDetails} />
      <Route exact path={'/signup'} component={SignUp} />
      <Route exact path={'/login'} component={Login} />
      <Route exact path={'/forgot-password'} component={ForgotPassword} />
      <Route exact path={'/collection'} component={Collection} />
      <Route exact path={'/profile'} component={Profile} />
      <Route exact path={'/profile/edit'} component={ProfileEdit} />
      <Route exact path={'/reset-password'} component={ResetPassword} />
      <Route exact path={'/product/:id'} component={ProductDetails} />
    </Switch>
  );
}
