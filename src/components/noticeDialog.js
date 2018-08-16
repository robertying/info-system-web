import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Chip from "@material-ui/core/Chip";
import { withStyles } from "@material-ui/core/styles";
import { upload } from "../helpers/file";
import auth from "../helpers/auth";

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
  }
});

class NoticeDialog extends React.Component {
  state = {
    open: false,
    files: [],
    title: "",
    content: ""
  };

  handleClickOpen = () => {
    this.setState({ open: true, files: [], title: "", content: "" });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleFileChange = e => {
    const files = [];
    const array = Array.from(e.target.files);
    array.map(file => {
      return files.push({
        key: array.indexOf(file),
        data: file
      });
    });
    this.setState({ files });
  };

  handleSubmit = () => {
    if (
      (this.state.title === undefined || this.state.title === "") &&
      (this.state.content === undefined || this.state.content === "")
    ) {
      this.props.handleSnackbarPopup("请填写公告标题和内容");
      return;
    } else if (this.state.title === undefined || this.state.title === "") {
      this.props.handleSnackbarPopup("请填写公告标题");
      return;
    } else if (this.state.content === undefined || this.state.content === "") {
      this.props.handleSnackbarPopup("请填写公告内容");
      return;
    }

    if (this.state.files.length === 0) {
      const body = {
        title: this.state.title,
        content: this.state.content,
        attachments: []
      };
      return fetch("/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }).then(res => {
        if (res.status === 201) {
          body.id = res.headers
            .get("Location")
            .split("/")
            .pop();
          this.props.handleDialogClose(body);
          this.handleClose();
          this.props.handleSnackbarPopup("新公告已发布");
        } else {
          this.props.handleSnackbarPopup("操作失败，请重试");
        }
      });
    } else {
      let attachments = [];
      Promise.all(
        this.state.files.map(file => {
          return new Promise(res =>
            upload(true, file.data).then(filename => {
              attachments.push(filename);
              res(attachments);
            })
          );
        })
      ).then(res => {
        const body = {
          title: this.state.title,
          content: this.state.content,
          attachments: attachments
        };
        fetch("/notices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }).then(res => {
          if (res.status === 201) {
            body.id = res.headers
              .get("Location")
              .split("/")
              .pop();
            this.props.handleDialogClose(body);
            this.handleClose();
            this.props.handleSnackbarPopup("新公告已发布");
          } else {
            this.props.handleSnackbarPopup("操作失败，请重试");
          }
        });
      });
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleChipDelete = file => () => {
    const files = [...this.state.files];
    const chipToDelete = files.indexOf(file);
    files.splice(chipToDelete, 1);
    this.setState({ files });
  };

  render = () => {
    const { classes } = this.props;

    return (
      <div>
        <Button onClick={this.handleClickOpen} variant="raised" color="primary">
          新公告
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">新公告</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              autoComplete="off"
              id="title"
              label="标题"
              fullWidth
              margin="normal"
              value={this.state.title}
              onChange={this.handleChange("title")}
            />
            <TextField
              multiline
              required
              autoComplete="off"
              rows="9"
              fullWidth
              label="内容"
              margin="normal"
              value={this.state.content}
              onChange={this.handleChange("content")}
            />
            <input
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              name="file"
              onChange={this.handleFileChange}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="raised"
                component="span"
                className={classes.button}
              >
                上传附件
              </Button>
            </label>
            <div className={classes.chips}>
              {this.state.files.map(file => {
                return (
                  <Chip
                    key={file.key}
                    label={file.data.name}
                    onDelete={this.handleChipDelete(file)}
                    className={classes.chip}
                  />
                );
              })}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              取消
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              发布
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}

NoticeDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withMobileDialog()(withStyles(styles)(NoticeDialog));
