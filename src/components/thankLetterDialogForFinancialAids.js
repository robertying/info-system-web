/**
 * 感谢信对话框
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
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import FileSaver from "file-saver";
import { download, trimFilename } from "../helpers/file";
import auth from "../helpers/auth";
import scholarshipConfig from "../config/scholarships";

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
  formControl: {
    margin: theme.spacing.unit
  }
});

class ThankLetterDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      files: [],
      salutation: "",
      content: "",
      status: "",
      index: props.index,
      id: props.id,
      title: props.title,
      buttonDisabled: props.buttonDisabled,
      readOnly: props.readOnly,
      attachments: []
    };
  }

  handleClickOpen = () => {
    if (this.props.variant === "outlined") {
      return;
    }

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
        if (
          res.financialAid.attachments &&
          res.financialAid.attachments[this.state.title]
        ) {
          this.setState({
            attachments: res.financialAid.attachments[this.state.title]
          });
        }

        const contents = res.financialAid.contents || {};
        if (contents[this.state.title]) {
          this.setState({
            salutation: contents[this.state.title].salutation,
            content: contents[this.state.title].content,
            status: contents[this.state.title].status
          });
        } else {
          const thanksSalutationsKeys = Object.keys(
            scholarshipConfig.thanksSalutations
          );
          for (let index = 0; index < thanksSalutationsKeys.length; index++) {
            const key = thanksSalutationsKeys[index];
            if (this.state.title.includes(key)) {
              this.setState({
                salutation: scholarshipConfig.thanksSalutations[key],
                status: "未提交"
              });
              break;
            }
          }
        }
      });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handlePass = choice => {
    const body = {
      financialAid: {
        contents: {
          [this.state.title]: {
            status: choice === "yes" ? "已通过" : "未通过"
          }
        }
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
        this.setState({ status: choice === "yes" ? "已通过" : "未通过" });
        this.props.handleDialogClose(
          this.state.id,
          this.state.title,
          choice === "yes" ? "已通过" : "未通过"
        );
        this.handleClose();
        this.props.handleSnackbarPopup("奖学金材料审核状态已更新");
      } else {
        this.props.handleSnackbarPopup("操作失败，请重试");
      }
    });
  };

  handleSubmit = () => {
    if (this.state.salutation === undefined || this.state.content === "") {
      this.props.handleSnackbarPopup("请完整填写感谢信");
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

            const body = {
              financialAid: {
                contents: {
                  [this.state.title]: {
                    salutation: this.state.salutation,
                    content: this.state.content,
                    status: "已提交"
                  }
                }
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
                this.props.handleSnackbarPopup("感谢信已提交");
              } else {
                this.props.handleSnackbarPopup("操作失败，请重试");
              }
            });
          }
        });
    } else {
      const body = {
        financialAid: {
          contents: {
            [this.state.title]: {
              salutation: this.state.salutation,
              content: this.state.content,
              status: "已提交"
            }
          }
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
          this.props.handleSnackbarPopup("感谢信已提交");
        } else {
          this.props.handleSnackbarPopup("操作失败，请重试");
        }
      });
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

  handlePreviewButtonClick = () => {
    fetch(
      `/thank-letters?id=${this.state.id}&title=${
        this.state.title
      }&type=financialAid`,
      {
        method: "GET"
      }
    )
      .then(res => {
        if (res.ok) {
          return res.blob();
        }
      })
      .then(blob => {
        if (blob) {
          FileSaver.saveAs(blob, "感谢信.pdf");
        } else {
          this.props.handleSnackbarPopup("请先提交感谢信内容");
        }
      });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      id: nextProps.id,
      title: nextProps.title,
      buttonDisabled: nextProps.buttonDisabled,
      readOnly: nextProps.readOnly
    };
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div>
        {this.state.readOnly ? (
          <Chip
            label={this.props.label}
            className={classes.chip}
            variant={this.props.variant}
            color={this.props.color}
            onClick={this.handleClickOpen}
          />
        ) : (
          <Button onClick={this.handleClickOpen} color="primary">
            感谢信
          </Button>
        )}
        <Dialog
          fullWidth
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.state.readOnly ? "感谢信查看" : "感谢信提交"}
          </DialogTitle>
          <DialogContent>
            {this.state.readOnly ? null : (
              <DialogContentText>
                请参考感谢信要求填写相应内容，提交后再次打开窗口点击“预览”可查看感谢信生成结果。请确保最终提交内容中的称呼、说辞、格式等正确无误。
              </DialogContentText>
            )}
            <TextField
              required
              fullWidth
              autoComplete="off"
              id="salutation"
              label="感谢信称呼"
              margin="normal"
              value={this.state.salutation}
              onChange={this.handleChange("salutation")}
              InputProps={{
                readOnly: this.state.readOnly
              }}
            />
            <TextField
              required
              autoFocus
              autoComplete="off"
              id="content"
              label="感谢信正文"
              multiline
              fullWidth
              rows="9"
              margin="normal"
              value={this.state.content}
              onChange={this.handleChange("content")}
              InputProps={{
                readOnly: this.state.readOnly
              }}
            />
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={this.handlePreviewButtonClick}
            >
              预览
            </Button>
            <div className={classes.chips}>
              {!scholarshipConfig.formRequired.every(
                x => !this.state.title.includes(x)
              ) && this.state.attachments.length === 0 ? (
                <Chip
                  label="未上传专用申请表！"
                  className={classes.chip}
                  color="secondary"
                />
              ) : (
                this.state.attachments.map((file, index) => {
                  return (
                    <Chip
                      key={index}
                      label={trimFilename(file)}
                      onClick={e => this.handleChipClick(e, file)}
                      className={classes.chip}
                    />
                  );
                })
              )}
            </div>
          </DialogContent>
          {this.state.readOnly ? (
            <DialogActions>
              <Button
                onClick={() => this.handlePass("no")}
                color="secondary"
                disabled={this.state.status === "未通过"}
              >
                不通过
              </Button>
              <Button
                onClick={() => this.handlePass("yes")}
                color="primary"
                disabled={this.state.status === "已通过"}
              >
                通过
              </Button>
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

ThankLetterDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withMobileDialog()(withStyles(styles)(ThankLetterDialog));
