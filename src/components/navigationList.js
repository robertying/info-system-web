/**
 * 导航栏
 */

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import StarsIcon from "@material-ui/icons/Stars";
import LibraryIcon from "@material-ui/icons/LocalLibrary";
import MoneyIcon from "@material-ui/icons/EuroSymbol";
import EventIcon from "@material-ui/icons/EventNote";
import FaceIcon from "@material-ui/icons/Face";
import Logo from "../assets/logo.png";

const styles = theme => ({
  root: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column"
  },
  flexGrow: {
    flexGrow: 1
  },
  flex: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  logoImage: {
    width: "30%",
    margin: 20
  }
});

class NavigationList extends React.Component {
  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.flexGrow}>
          <List>
            <ListSubheader>综合</ListSubheader>
            <ListItem button component={Link} to="/notices" replace>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="公告" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListSubheader>新生导师</ListSubheader>
            <ListItem button component={Link} to="/mentors" replace>
              <ListItemIcon>
                <FaceIcon />
              </ListItemIcon>
              <ListItemText primary="新生导师" />
            </ListItem>
          </List>
          <Divider />
          <List component="nav">
            <ListSubheader>奖助学金</ListSubheader>
            <ListItem button component={Link} to="/honors" replace>
              <ListItemIcon>
                <StarsIcon />
              </ListItemIcon>
              <ListItemText primary="荣誉" />
            </ListItem>
            <ListItem button component={Link} to="/scholarships" replace>
              <ListItemIcon>
                <LibraryIcon />
              </ListItemIcon>
              <ListItemText primary="奖学金" />
            </ListItem>
            <ListItem button component={Link} to="/financial-aid" replace>
              <ListItemIcon>
                <MoneyIcon />
              </ListItemIcon>
              <ListItemText primary="助学金" />
            </ListItem>
          </List>
        </div>
        <div className={classes.flex}>
          <img className={classes.logoImage} src={Logo} alt="logo" />
        </div>
      </div>
    );
  };
}

NavigationList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavigationList);
