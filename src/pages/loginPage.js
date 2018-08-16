import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Card from "@material-ui/core/Card";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Logo from "../assets/logo.png";
import auth from "../helpers/auth";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: "100vh",
    width: "100%"
  },
  flex: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    maxWidth: 300,
    marginTop: "2.5%",
    height: "70%",
    paddingTop: "5%",
    paddingBottom: "5%",
    textAlign: "center"
  },
  logoImage: {
    width: "40%",
    margin: theme.spacing.unit
  },
  textField: {
    width: "65%",
    margin: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit,
    marginTop: "15%"
  }
});

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  state = {
    id: "",
    password: "",
    showPassword: false
  };

  handleSnackbarPopup = message => {
    this.props.handleSnackbarPopup(message);
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    auth
      .login(this.state.id, this.state.password)
      .then(res => {
        this.props.history.replace("/");
      })
      .catch(err => {
        this.handleSnackbarPopup("登录失败，请重试");
      });
  };

  componentWillMount() {
    if (auth.isLoggedIn()) this.props.history.replace("/");
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>
              信息管理系统・清华大学电子工程系
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.flex}>
          <Card className={classes.card} raised>
            <img className={classes.logoImage} src={Logo} alt="logo" />
            <div>
              <TextField
                id="username"
                label="用户名"
                placeholder="学号 / 工作证号"
                className={classes.textField}
                value={this.state.id}
                onChange={this.handleChange("id")}
                margin="normal"
              />
            </div>
            <div>
              <FormControl className={classes.textField}>
                <InputLabel htmlFor="adornment-password">密码</InputLabel>
                <Input
                  spellCheck="false"
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
            </div>
            <Button
              className={classes.button}
              variant="raised"
              color="primary"
              onClick={this.handleFormSubmit}
            >
              登录
            </Button>
          </Card>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginPage);
