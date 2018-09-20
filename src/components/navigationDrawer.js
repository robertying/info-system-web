/**
 * 网页主体框架
 */

import React from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import MenuIcon from "@material-ui/icons/Menu";
import NavigationList from "./navigationList";
import ProfileMenu from "./profileMenu";
import NoticesPage from "../pages/noticesPage";
import MentorsPage from "../pages/mentorsPage";
import HonorsPage from "../pages/honorsPage";
import ScholarshipsPage from "../pages/scholarshipsPage";
import FinancialAidPage from "../pages/financialAidPage";
import ProfilePage from "../pages/profilePage";
import AboutPage from "../pages/aboutPage";
import auth from "../helpers/auth";
import year from "../config/year";
import InfoDialog from "../components/infoDialog";
const fetch = auth.authedFetch;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    height: "100vh"
  },
  flex: {
    display: "flex"
  },
  appBar: {
    position: "absolute",
    zIndex: theme.zIndex.drawer + 1,
    display: "flex",
    justifyContent: "space-between"
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 240,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  flexGrow: {
    flex: 1
  },
  drawer: {
    height: `calc(100% - 64px)`
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default
  }
});

class NavigationDrawer extends React.Component {
  state = {
    mobileOpen: false,
    infoUpdated: true
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleSnackbarPopup = message => {
    this.props.handleSnackbarPopup(message);
  };

  // 给对应页面添加通知功能
  WithSnackbarNoticesPage = props => {
    return (
      <NoticesPage handleSnackbarPopup={this.handleSnackbarPopup} {...props} />
    );
  };

  WithSnackbarMentorsPage = props => {
    return (
      <MentorsPage handleSnackbarPopup={this.handleSnackbarPopup} {...props} />
    );
  };

  WithSnackbarHonorsPage = props => {
    return (
      <HonorsPage handleSnackbarPopup={this.handleSnackbarPopup} {...props} />
    );
  };

  WithSnackbarScholarshipsPage = props => {
    return (
      <ScholarshipsPage
        handleSnackbarPopup={this.handleSnackbarPopup}
        {...props}
      />
    );
  };

  WithSnackbarFinancialAidPage = props => {
    return (
      <FinancialAidPage
        handleSnackbarPopup={this.handleSnackbarPopup}
        {...props}
      />
    );
  };

  WithSnackbarProfilePage = props => {
    return (
      <ProfilePage handleSnackbarPopup={this.handleSnackbarPopup} {...props} />
    );
  };

  // 每年强制更新信息
  componentDidMount = () => {
    fetch(`/users/${auth.getRole()}s/${auth.getId()}`, {
      method: "GET"
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(res => {
        this.setState({
          infoUpdated: res.infoUpdated === year ? true : false
        });
      });
  };

  handleDialogClose = () => {
    this.setState({ infoUpdated: true });
  };

  render = () => {
    const { classes, theme } = this.props;

    const drawer = (
      <div className={classes.flexGrow}>
        <div className={classes.drawer}>
          <div className={classes.toolbar} />
          <NavigationList />
        </div>
      </div>
    );

    return (
      <Router>
        <div className={classes.root}>
          <InfoDialog
            open={!this.state.infoUpdated}
            handleSnackbarPopup={this.handleSnackbarPopup}
            handleDialogClose={this.handleDialogClose}
          />
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                className={classes.flexGrow}
                variant="title"
                color="inherit"
                noWrap
              >
                信息管理系统・清华大学电子工程系
              </Typography>
              <ProfileMenu />
            </Toolbar>
          </AppBar>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{ paper: classes.drawerPaper }}
              ModalProps={{ keepMounted: true }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              className={classes.flex}
              variant="permanent"
              open
              classes={{ paper: classes.drawerPaper }}
            >
              {drawer}
            </Drawer>
          </Hidden>

          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              <Route
                exact
                path="/notices"
                component={this.WithSnackbarNoticesPage}
              />
              <Route
                exact
                path="/honors"
                component={this.WithSnackbarHonorsPage}
              />
              <Route
                exact
                path="/scholarships"
                component={this.WithSnackbarScholarshipsPage}
              />
              <Route
                exact
                path="/financial-aid"
                component={this.WithSnackbarFinancialAidPage}
              />
              <Route
                exact
                path="/mentors"
                component={this.WithSnackbarMentorsPage}
              />
              <Route
                exact
                path="/profile"
                component={this.WithSnackbarProfilePage}
              />
              <Route exact path="/about" component={AboutPage} />
              <Redirect exact path="/" to="/notices" />
            </Switch>
          </main>
        </div>
      </Router>
    );
  };
}

NavigationDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(NavigationDrawer);
