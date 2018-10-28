/**
 * 表单内容对话框
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Chip from "@material-ui/core/Chip";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { withStyles } from "@material-ui/core/styles";
import { upload } from "../helpers/file";
import auth from "../helpers/auth";
import year from "../config/year";
import AlertDialog from "./alertDialog";

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

const form = {
  type: "新生导师",
  dialogTitle: "新生导师申请",
  dialogContentText:
    "请在正式提出申请前，通过邮件与所选择的导师充分沟通，以避免落选。请勿直接在网页上编辑附言，以免会话超时导致提交失败。",
  dialogContent: [
    {
      label: "附言",
      id: "statement",
      required: false,
      autoFocus: true,
      multiline: true,
      rows: "9"
    }
  ],
  dialogAction: [
    { id: "cancel", buttonContent: "取消" },
    { id: "submit", buttonContent: "提交" }
  ],
  hasAttachments: false,
  url: "/applications",
  postBody: {
    applicantId: 0,
    applicantName: "",
    year: 0,
    mentor: {
      status: {},
      contents: {}
    }
  },
  submittedText: "申请已提交"
};

class FormDialog extends React.Component {
  state = {
    open: false,
    buttonDisabled: this.props.buttonDisabled,
    buttonContent: this.props.buttonContent,
    files: [],
    form: form,
    confirmDialogOpen: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
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

  handleChipDelete = file => () => {
    const files = [...this.state.files];
    const chipToDelete = files.indexOf(file);
    files.splice(chipToDelete, 1);
    this.setState({ files });
  };

  handleSubmit = () => {
    let isComplete = true;
    this.state.form.dialogContent.map(n => {
      if (this.state[n.id] === undefined || this.state[n.id] === null) {
        return (isComplete = false);
      } else {
        return null;
      }
    });
    if (!isComplete) {
      this.props.handleSnackbarPopup("请完整填写所有内容");
    } else {
      this.setState({ confirmDialogOpen: true });
    }
  };

  handleConfirmDialogClose = choice => {
    if (choice === "no") {
      this.setState({ confirmDialogOpen: false });
    } else if (choice === "yes") {
      let body = {};
      body = this.state.form.postBody;
      body.applicantId = auth.getId();
      body.applicantName = auth.getName();
      body.year = year;
      body[this.props.type] = {
        status: { [this.props.userfulData.name]: "申请中" },
        contents: { statement: this.state["statement"] }
      };

      // 没有附件
      if (this.state.files.length === 0) {
        return fetch(this.state.form.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }).then(res => {
          if (res.ok) {
            this.setState({ confirmDialogOpen: false });
            this.props.handleDialogClose();
            this.handleClose();
            this.props.handleSnackbarPopup(this.state.form.submittedText);
          } else {
            this.props.handleSnackbarPopup("操作失败，请重试");
          }
        });
      } else {
        // 有附件
        let attachments = [];
        Promise.all(
          this.state.files.map(file => {
            return new Promise(res =>
              upload(this.state.form.isFilePublic, file.data).then(filename => {
                attachments.push(filename);
                res(attachments);
              })
            );
          })
        ).then(res => {
          body.attachments = attachments;
          return fetch(this.state.form.postUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          })
            .then(res => res.json())
            .then(res => {
              this.props.handleDialogClose(res);
              this.handleClose();
              this.props.handleSnackbarPopup(this.state.form.submittedText);
            });
        });
      }
    }
  };

  // parent 的 state 经 props 控制此 child 的 state
  static getDerivedStateFromProps(nextProps, prevState) {
    return { buttonDisabled: nextProps.buttonDisabled };
  }

  render() {
    const { classes } = this.props;

    const Attachment = () => {
      if (this.state.form.hasAttachments) {
        return (
          <div>
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
                variant="contained"
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
          </div>
        );
      } else {
        return null;
      }
    };

    return (
      <div>
        <AlertDialog
          hasCancel
          title="提交申请"
          content="是否要提交此申请？"
          open={this.state.confirmDialogOpen}
          handleClose={this.handleConfirmDialogClose}
        />
        <Button
          color="primary"
          disabled={this.state.buttonDisabled}
          onClick={this.handleClickOpen}
        >
          {this.state.buttonContent}
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.state.form.dialogTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.form.dialogContentText}
            </DialogContentText>
            {this.state.form.dialogContent.map((n, index) => {
              return (
                <TextField
                  key={index}
                  required={n.required}
                  autoFocus={n.autoFocus}
                  fullWidth
                  multiline={n.multiline}
                  rows={n.rows}
                  margin="normal"
                  autoComplete="off"
                  id={n.id}
                  label={n.label}
                  value={this.state[n.id]}
                  onChange={this.handleChange(n.id)}
                />
              );
            })}
            <Attachment />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              {this.state.form.dialogAction[0].buttonContent}
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              {this.state.form.dialogAction[1].buttonContent}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

FormDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};

export default withMobileDialog()(withStyles(styles)(FormDialog));
