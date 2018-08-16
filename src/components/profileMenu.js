import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import auth from "../helpers/auth";

class ProfileMenu extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleLogout = () => {
    this.setState({ anchorEl: null });
    auth.logout();
    window.location.reload();
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render = () => {
    const { anchorEl } = this.state;

    return (
      <div>
        <Button
          color="inherit"
          aria-owns={anchorEl ? "profile-menu" : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          {auth.getName()}
        </Button>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {auth.getRole() === "student" ? (
            <MenuItem onClick={this.handleClose} component={Link} to="/profile">
              个人信息
            </MenuItem>
          ) : null}
          <MenuItem onClick={this.handleLogout}>退出登录</MenuItem>
          <Divider />
          <MenuItem onClick={this.handleClose} component={Link} to="/about">
            关于
          </MenuItem>
        </Menu>
      </div>
    );
  };
}

export default ProfileMenu;
