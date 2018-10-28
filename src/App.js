/**
 * 网站 route 管理
 */

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import NavigationDrawer from "./components/navigationDrawer";
import LoginPage from "./pages/loginPage";
import withAuth from "./components/withAuthRoute";
import Snackbar from "./components/consecutiveSnackbars";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: '"Noto Sans", "Noto Sans SC Sliced", sans-serif'
  }
});

class App extends React.Component {
  handleSnackbarPopup = message => {
    this.snackbar.handlePopup(message);
  };

  WithSnackbarLoginPage = props => {
    return (
      <LoginPage handleSnackbarPopup={this.handleSnackbarPopup} {...props} />
    );
  };

  WithSnackbarNavigationDrawer = props => {
    return (
      <NavigationDrawer
        handleSnackbarPopup={this.handleSnackbarPopup}
        {...props}
      />
    );
  };

  WithAuthRoute = withAuth(
    <Route exact path="/" component={this.WithSnackbarNavigationDrawer} />
  );

  render = () => {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <Router>
            <Switch>
              <Route
                exact
                path="/login"
                component={this.WithSnackbarLoginPage}
              />
              <this.WithAuthRoute />
              <Redirect exact path="/notices" to="/" />
              <Redirect exact path="/mentors" to="/" />
              <Redirect exact path="/scholarships" to="/" />
              <Redirect exact path="/financial-aid" to="/" />
              <Redirect exact path="/scholarships" to="/" />
              <Redirect exact path="/profile" to="/" />
              <Redirect exact path="/about" to="/" />
            </Switch>
          </Router>
          <Snackbar onRef={ref => (this.snackbar = ref)} />
        </div>
      </MuiThemeProvider>
    );
  };
}

export default App;
