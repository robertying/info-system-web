/**
 * 个人信息页面
 */

import React from "react";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import auth from "../helpers/auth";
import AlertDialog from "../components/alertDialog";
import year from "../config/year";

const fetch = auth.authedFetch;

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    overflow: "auto",
    height: `calc(100vh - 113px)`
  },
  container: {
    maxWidth: 700,
    width: "85vw",
    marginLeft: "auto",
    marginRight: "auto"
  },
  paper: theme.mixins.gutters({
    overflowX: "auto",
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  }),
  button: {
    margin: theme.spacing.unit
  },
  textField: {
    margin: theme.spacing.unit
  },
  chip: {
    margin: theme.spacing.unit
  }
});

class ProfilePage extends React.Component {
  state = {
    dialogOpen: false,
    name: "",
    id: "",
    class: "",
    email: "",
    phone: "",
    degree: "",
    department: "",
    grade: "",
    showPassword: false,
    password: "",
    passwordRepeat: ""
  };

  componentDidMount = () => {
    fetch(`/users/${auth.getRole()}s/${auth.getId()}`, {
      method: "GET"
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return {};
        }
      })
      .then(res => {
        this.setState({
          name: res.name,
          id: res.id,
          class: res.class,
          email: res.email,
          phone: res.phone,
          degree: res.degree,
          department: res.department,
          grade: res.degree
        });
      });
  };

  handleDialogClose = choice => {
    if (choice === "no") {
      this.setState({ dialogOpen: false });
    } else {
      let body;
      if (this.state.password === "" || this.state.password == null) {
        body = {
          email: this.state.email,
          phone: this.state.phone,
          infoUpdated: year
        };
      } else {
        body = {
          email: this.state.email,
          phone: this.state.phone,
          password: this.state.password,
          infoUpdated: year
        };
      }

      fetch(`/users/${auth.getRole()}s/${auth.getId()}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }).then(res => {
        if (res.ok) {
          this.setState({ dialogOpen: false });
          this.props.handleSnackbarPopup("个人信息已更新");
        } else {
          this.props.handleSnackbarPopup("网络错误，请重试");
        }
      });
    }
  };

  handleSubmit = () => {
    if (this.state.password !== this.state.passwordRepeat) {
      this.props.handleSnackbarPopup("密码重复错误，请重新输入");
    } else {
      this.setState({ dialogOpen: true });
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
      <div className={classes.root}>
        <div className={classes.container}>
          <Typography variant="display2">个人信息</Typography>
          <Paper className={classes.paper}>
            <List>
              <div>
                <TextField
                  disabled
                  className={classes.textField}
                  label="姓名"
                  value={this.state.name}
                />
                {auth.getRole() === "student" ? (
                  <TextField
                    disabled
                    className={classes.textField}
                    label="学号"
                    value={this.state.id}
                  />
                ) : auth.getRole() === "reviewer" ? (
                  <TextField
                    disabled
                    className={classes.textField}
                    label="管理年级"
                    value={this.state.grade}
                  />
                ) : (
                  <TextField
                    disabled
                    className={classes.textField}
                    label="院系"
                    value={this.state.department}
                  />
                )}
              </div>
              {auth.getRole() === "student" ? (
                <div>
                  <TextField
                    disabled
                    className={classes.textField}
                    label="班级"
                    value={this.state.class}
                  />
                  <TextField
                    disabled
                    className={classes.textField}
                    label="类型"
                    value={this.state.degree}
                  />
                </div>
              ) : null}
              <div>
                <TextField
                  className={classes.textField}
                  label="邮箱"
                  value={this.state.email}
                  onChange={this.handleChange("email")}
                />
                <TextField
                  className={classes.textField}
                  label="电话"
                  value={this.state.phone}
                  onChange={this.handleChange("phone")}
                />
              </div>
              <div>
                <FormControl className={classes.textField}>
                  <InputLabel htmlFor="adornment-password">新密码</InputLabel>
                  <Input
                    spellCheck="false"
                    required
                    id="adornment-password"
                    type={this.state.showPassword ? "text" : "password"}
                    value={this.state.password}
                    placeholder="留空则不更新"
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
                    placeholder="留空则不更新"
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
            </List>
            <Button
              className={classes.button}
              variant="raised"
              color="primary"
              onClick={this.handleSubmit}
            >
              修改
            </Button>
          </Paper>
        </div>
        <AlertDialog
          title="修改个人信息"
          content="是否确定修改个人信息？"
          fullscreen={false}
          hasCancel={true}
          handleClose={this.handleDialogClose}
          open={this.state.dialogOpen}
        />
      </div>
    );
  }
}

ProfilePage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfilePage);
