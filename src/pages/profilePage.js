import React from "react";
import FileSaver from "file-saver";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import auth from "../helpers/auth";
import AlertDialog from "../components/alertDialog";
const fetch = auth.authedFetch;

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    overflow: "auto",
    height: `calc(100vh - 113px)`
  },
  container: {
    maxWidth: 700,
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
    profile: {
      name: "",
      id: "",
      class: "",
      secondaryTranscriptFile: ""
    },
    dialogOpen: false
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
        this.setState({ profile: res });
      });
  };

  handleChipClick = filename => {
    fetch("/files/private/" + filename)
      .then(res => res.blob())
      .then(blob => FileSaver.saveAs(blob, filename));
  };

  handleButtonClick = e => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = choice => {
    this.setState({ dialogOpen: false });
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
                  className={classes.textField}
                  label="姓名"
                  value={this.state.profile.name}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  className={classes.textField}
                  label="学号"
                  value={this.state.profile.id}
                  InputProps={{ readOnly: true }}
                />
              </div>
              <div>
                <TextField
                  className={classes.textField}
                  label="邮箱"
                  value={this.state.profile.email}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  className={classes.textField}
                  label="电话"
                  value={this.state.profile.phone}
                  InputProps={{ readOnly: true }}
                />
              </div>
              <div>
                <TextField
                  className={classes.textField}
                  label="班级"
                  value={this.state.profile.class}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  className={classes.textField}
                  label="类型"
                  value={this.state.profile.degree}
                  InputProps={{ readOnly: true }}
                />
              </div>
            </List>
            <Button
              className={classes.button}
              variant="raised"
              color="primary"
              onClick={this.handleButtonClick}
            >
              修改
            </Button>
            {/* <Divider />
            <div>
              <Chip
                label="第二成绩单"
                onClick={() =>
                  this.handleChipClick(
                    this.state.profile.secondaryTranscriptFile
                  )
                }
                className={classes.chip}
              />
            </div> */}
          </Paper>
        </div>
        <AlertDialog
          title="修改个人信息"
          content="请联系辅导员来修改个人信息"
          fullscreen={false}
          hasCancel={false}
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
