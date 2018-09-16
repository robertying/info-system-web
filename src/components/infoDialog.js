/**
 * 个人信息更新对话框
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { withStyles } from "@material-ui/core/styles";
import AlertDialog from "../components/alertDialog";
import auth from "../helpers/auth";
import year from "../config/year";

const fetch = auth.authedFetch;

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    marginLeft: 0
  },
  input: {
    display: "none"
  },
  chips: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    padding: theme.spacing.unit / 2
  },
  chip: {
    margin: theme.spacing.unit / 2,
    marginLeft: 0
  },
  flexContainer: {
    display: "flex",
    flexDirection: "column"
  },
  textField: {
    margin: theme.spacing.unit
  }
});

class InfoDialog extends React.Component {
  state = {
    open: this.props.open,
    confirmDialogOpen: false,
    showPassword: false,
    email: "",
    phone: "",
    password: ""
  };

  // 由 parent 控制此 child 的状态
  static getDerivedStateFromProps(nextProps, prevState) {
    return { open: nextProps.open };
  }

  handleConfirmDialogClose = choice => {
    if (choice === "no") {
      this.setState({ confirmDialogOpen: false });
    } else {
      let body = {
        email: this.state.email,
        phone: this.state.phone,
        password: this.state.password,
        infoUpdated: year
      };
      fetch(`/users/${auth.getRole()}s/${auth.getId()}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }).then(res => {
        if (res.ok) {
          this.setState({ confirmDialogOpen: false });
          this.props.handleDialogClose();
          this.props.handleSnackbarPopup("个人信息已更新");
        } else {
          this.props.handleSnackbarPopup("网络错误，请重试");
        }
      });
    }
  };

  handleSubmit = () => {
    if (!this.state.email || !this.state.password) {
      this.props.handleSnackbarPopup("请完整填写所有信息");
    } else if (this.state.password !== this.state.passwordRepeat) {
      this.props.handleSnackbarPopup("密码重复错误，请重新输入");
    } else {
      this.setState({ confirmDialogOpen: true });
    }
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <AlertDialog
          hasCancel
          title="更新个人信息"
          content="请再次确认填写的信息是否正确，确定更新？"
          open={this.state.confirmDialogOpen}
          handleClose={this.handleConfirmDialogClose}
        />
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">更新个人信息</DialogTitle>
          <DialogContent>
            <DialogContentText>
              请及时更新个人信息，并保证信息填写正确。
            </DialogContentText>
            <div className={classes.flexContainer}>
              <TextField
                className={classes.textField}
                required
                autoFocus
                margin="normal"
                autoComplete="off"
                id="email"
                label="邮箱"
                value={this.state.email}
                onChange={this.handleChange("email")}
              />
              <TextField
                className={classes.textField}
                required
                margin="normal"
                autoComplete="off"
                id="phone"
                label="手机"
                value={this.state.phone}
                onChange={this.handleChange("phone")}
              />
              <FormControl className={classes.textField}>
                <InputLabel htmlFor="adornment-password">新密码</InputLabel>
                <Input
                  spellCheck="false"
                  required
                  id="adornment-password"
                  type={this.state.showPassword ? "text" : "password"}
                  value={this.state.password}
                  onChange={this.handleChange("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {this.state.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl className={classes.textField}>
                <InputLabel htmlFor="new-adornment-password">
                  重复新密码
                </InputLabel>
                <Input
                  required
                  spellCheck="false"
                  id="new-adornment-password"
                  type={this.state.showPassword ? "text" : "password"}
                  value={this.state.passwordRepeat}
                  onChange={this.handleChange("passwordRepeat")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {this.state.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSubmit} color="primary">
              更新
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

InfoDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withMobileDialog()(withStyles(styles)(InfoDialog));
