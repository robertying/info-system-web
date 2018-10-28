/**
 * 材料提交对话框
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Chip from "@material-ui/core/Chip";
import { withStyles } from "@material-ui/core/styles";
import { upload, download, trimFilename } from "../helpers/file";
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
  }
});

class MatrialDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      files: [],
      reason: "",
      id: props.id,
      buttonDisabled: props.buttonDisabled,
      readOnly: props.readOnly
    };
  }

  handleClickOpen = () => {
    if (this.state.readOnly) {
      this.setState({ open: true });
      fetch("/applications/" + this.state.id, {
        method: "GET"
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        })
        .then(res => {
          this.setState({ reason: res.honor.contents.reason });
          this.setState({ files: res.honor.attachments });
        });
    }
    this.setState({ open: true, files: [], content: "" });
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
    if (this.state.reason === undefined || this.state.reason === "") {
      this.props.handleSnackbarPopup("请填写申请理由");
      return;
    }

    if (this.state.id == null || this.state.id === "") {
      fetch(`/applications?applicantId=${auth.getId()}`, {
        method: "GET"
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        })
        .then(res => {
          if (res && res[0]) {
            this.setState({ id: res[0].id });
            const id = res[0].id;

            if (this.state.files.length === 0) {
              const body = {
                honor: {
                  contents: {
                    reason: this.state.reason
                  },
                  attachments: []
                }
              };
              return fetch("/applications/" + id, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
              }).then(res => {
                if (res.status === 204) {
                  this.props.handleDialogClose(body);
                  this.handleClose();
                  this.props.handleSnackbarPopup("申请材料已提交");
                } else {
                  this.props.handleSnackbarPopup("操作失败，请重试");
                }
              });
            } else {
              let attachments = [];
              Promise.all(
                this.state.files.map(file => {
                  return new Promise(res =>
                    upload(false, file.data).then(filename => {
                      attachments.push(filename);
                      res(attachments);
                    })
                  );
                })
              ).then(res => {
                const body = {
                  honor: {
                    contents: {
                      reason: this.state.reason
                    },
                    attachments: attachments
                  }
                };
                fetch("/applications/" + id, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(body)
                }).then(res => {
                  if (res.status === 204) {
                    this.props.handleDialogClose(body);
                    this.handleClose();
                    this.props.handleSnackbarPopup("申请材料已提交");
                  } else {
                    this.props.handleSnackbarPopup("操作失败，请重试");
                  }
                });
              });
            }
          } else {
            if (this.state.files.length === 0) {
              const body = {
                applicantId: auth.getId(),
                applicantName: auth.getName(),
                year: year,
                honor: {
                  contents: {
                    reason: this.state.reason
                  },
                  attachments: []
                }
              };
              return fetch("/applications", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
              }).then(res => {
                if (res.status === 201) {
                  this.props.handleDialogClose(body);
                  this.handleClose();
                  this.props.handleSnackbarPopup("申请材料已提交");
                } else {
                  this.props.handleSnackbarPopup("操作失败，请重试");
                }
              });
            } else {
              let attachments = [];
              Promise.all(
                this.state.files.map(file => {
                  return new Promise(res =>
                    upload(false, file.data).then(filename => {
                      attachments.push(filename);
                      res(attachments);
                    })
                  );
                })
              ).then(res => {
                const body = {
                  applicantId: auth.getId(),
                  applicantName: auth.getName(),
                  year: year,
                  honor: {
                    contents: {
                      reason: this.state.reason
                    },
                    attachments: attachments
                  }
                };
                fetch("/applications", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(body)
                }).then(res => {
                  if (res.status === 201) {
                    this.props.handleDialogClose(body);
                    this.handleClose();
                    this.props.handleSnackbarPopup("申请材料已提交");
                  } else {
                    this.props.handleSnackbarPopup("操作失败，请重试");
                  }
                });
              });
            }
          }
        });
    } else {
      if (this.state.files.length === 0) {
        const body = {
          honor: {
            contents: {
              reason: this.state.reason
            },
            attachments: []
          }
        };
        return fetch("/applications/" + this.state.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }).then(res => {
          if (res.status === 204) {
            this.props.handleDialogClose(body);
            this.handleClose();
            this.props.handleSnackbarPopup("申请材料已提交");
          } else {
            this.props.handleSnackbarPopup("操作失败，请重试");
          }
        });
      } else {
        let attachments = [];
        Promise.all(
          this.state.files.map(file => {
            return new Promise(res =>
              upload(false, file.data).then(filename => {
                attachments.push(filename);
                res(attachments);
              })
            );
          })
        ).then(res => {
          const body = {
            honor: {
              contents: {
                reason: this.state.reason
              },
              attachments: attachments
            }
          };
          fetch("/applications/" + this.state.id, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }).then(res => {
            if (res.status === 204) {
              this.props.handleDialogClose(body);
              this.handleClose();
              this.props.handleSnackbarPopup("申请材料已提交");
            } else {
              this.props.handleSnackbarPopup("操作失败，请重试");
            }
          });
        });
      }
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleChipClick = (e, filename) => {
    download(false, filename);
  };

  handleChipDelete = file => () => {
    const files = [...this.state.files];
    const chipToDelete = files.indexOf(file);
    files.splice(chipToDelete, 1);
    this.setState({ files });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      id: nextProps.id,
      buttonDisabled: nextProps.buttonDisabled,
      readOnly: nextProps.readOnly
    };
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div>
        {this.state.readOnly ? (
          <Button
            className={classes.button}
            onClick={this.handleClickOpen}
            color="primary"
            disabled={this.state.buttonDisabled}
          >
            申请材料
          </Button>
        ) : (
          <Button
            className={classes.button}
            onClick={this.handleClickOpen}
            color="primary"
            variant="contained"
            disabled={this.state.buttonDisabled}
          >
            提交申请材料
          </Button>
        )}
        <Dialog
          fullWidth
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.state.readOnly ? "申请材料查看" : "申请材料提交"}
          </DialogTitle>
          <DialogContent>
            {this.state.readOnly ? null : (
              <DialogContentText>
                申请材料需体现申请人在德育、智育、体育、社会工作、科技学术活动及文体特长等方面的基本情况（计划申请助学金的同学需填写家庭经济状况），并着重说明申请相关荣誉的理由。（注意：申请理由不得超过
                500
                字；上传附件可以多选；再次提交申请材料将覆盖原有材料，请提前做好备份）
              </DialogContentText>
            )}
            <TextField
              required
              autoFocus
              autoComplete="off"
              id="reason"
              label="申请理由"
              multiline
              fullWidth
              rows="9"
              margin="normal"
              value={this.state.reason}
              onChange={this.handleChange("reason")}
              InputProps={{
                readOnly: this.state.readOnly
              }}
            />
            {this.state.readOnly ? null : (
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
              </div>
            )}
            <div className={classes.chips}>
              {this.state.files.map((file, index) => {
                return this.state.readOnly ? (
                  <Chip
                    key={index}
                    label={trimFilename(file)}
                    onClick={e => this.handleChipClick(e, file)}
                    className={classes.chip}
                  />
                ) : (
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
          {this.state.readOnly ? (
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                关闭
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                取消
              </Button>
              <Button onClick={this.handleSubmit} color="primary">
                提交
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </div>
    );
  };
}

MatrialDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withMobileDialog()(withStyles(styles)(MatrialDialog));
