import { Route, Switch } from "react-router-dom";
import Login from "pages/Login";
import SignUp from "pages/SignUp";
import ForgotPassword from "pages/ForgotPassword";
import ProductDetails from "pages/ProductDetails";
import Collection from "pages/Collection";
import Profile from "pages/Profile/Profile";
import ProfileEdit from "pages/ProfileEdit";
import ResetPassword from "pages/ResetPassword";
import MagicLink from "pages/MagicLink";
import PersonalDetails from "pages/PersonalDetails"

export default function Routes() {
  return (
    <Switch>
      <Route exact path={"/"} component={Login} />
      <Route exact path={"/signup"} component={SignUp} />
      <Route exact path={"/forgot-password"} component={ForgotPassword} />
      <Route exact path={"/collection"} component={Collection} />
      <Route exact path={"/profile"} component={Profile} />
      <Route exact path={"/profile/edit"} component={ProfileEdit} />
      <Route exact path={"/reset-password"} component={ResetPassword} />
      <Route exact path={"/product/:id"} component={ProductDetails} />
      <Route exact path={"/magic-link"} component={MagicLink} />
      <Route exact path={"/personal-details"} component={PersonalDetails} />
    </Switch>
  );
}
