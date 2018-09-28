/**
 * 解析 Excel 文件并上传数据
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import auth from "../helpers/auth";
import year from "../config/year";

const fetch = auth.authedFetch;

const styles = theme => ({
  button: {
    margin: theme.spacing.unit * 3,
    marginLeft: 0
  },
  input: {
    display: "none"
  },
  flex: {
    display: "flex"
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
  progress: {
    margin: theme.spacing.unit * 3,
    marginLeft: 0,
    marginTop: theme.spacing.unit * 4 - 3
  }
});

class XLSXParser extends React.Component {
  state = {
    completed: 100,
    progressType: "indeterminate",
    progressHidden: true
  };

  head = [
    "学业优秀奖",
    "科技创新优秀奖",
    "社会工作优秀奖",
    "社会实践优秀奖",
    "志愿公益优秀奖",
    "文艺优秀奖",
    "体育优秀奖",
    "学习进步奖",
    "综合优秀奖",
    "无校级荣誉"
  ];

  handleSnackbarPopup = message => {
    this.props.handleSnackbarPopup(message);
  };

  handleFileChange = e => {
    this.setState({ progressHidden: false });
    const file = e.target.files[0];

    import("xlsx").then(XLSX => {
      const rABS = true;
      const reader = new FileReader();
      reader.onload = e => {
        let data = e.target.result;
        if (!rABS) data = new Uint8Array(data);
        const workbook = XLSX.read(data, { type: rABS ? "binary" : "array" });

        const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(firstWorksheet, { header: 1 });

        // 校验文件
        let flag = false;
        data.shift();
        if (this.props.type !== "honor") {
          data.forEach((n, index) => {
            if (n.length % 2) {
              this.handleSnackbarPopup(`格式错误：第 ${index + 2} 行`);
              flag = true;
            }
          });
        } else {
          data.forEach((n, index) => {
            if (n.length !== 14) {
              this.handleSnackbarPopup(`格式错误：第 ${index + 2} 行`);
              flag = true;
            }
          });
        }
        if (flag) {
          this.setState({ progressHidden: true });
          return;
        }

        // 开始上传
        this.handleSnackbarPopup("开始上传");
        this.setState({ progressType: "static" });
        const total = data.length;
        let count = 0;
        flag = false;

        data.forEach(n => {
          if (flag) {
            return;
          }

          let status = {};
          if (this.props.type !== "honor") {
            for (let index = 4; index < n.length; index = index + 2) {
              const title = n[index].trim();
              const amount = n[index + 1];
              status[title] = amount;
            }
          } else {
            for (let index = 4; index < n.length; index++) {
              if (n[index] !== "") {
                const title = this.head[index - 4].trim()
                status[title] = n[index].trim();
              }
            }
          }

          fetch(`/applications?applicantId=${n[2]}`, {
            method: "GET"
          })
            .then(res => {
              if (res.ok) {
                return res.json();
              }
            })
            .then(res => {
              if (res && res[0]) {
                fetch("/applications/" + res[0].id, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(
                    this.props.type === "scholarship"
                      ? {
                          applicantId: n[2],
                          applicantName: n[0],
                          year: year,
                          scholarship: {
                            status: status
                          }
                        }
                      : this.props.type === "financialAid"
                        ? {
                            applicantId: n[2],
                            applicantName: n[0],
                            year: year,
                            financialAid: {
                              status: status
                            }
                          }
                        : {
                            applicantId: n[2],
                            applicantName: n[0],
                            year: year,
                            honor: {
                              status: status
                            }
                          }
                  )
                }).then(res => {
                  if (res.status === 204) {
                    count++;
                    this.setState({ completed: (count / total) * 100 });
                    if (count === total) {
                      this.handleSnackbarPopup("上传完成");
                      this.setState({ progressHidden: true });
                    }
                  } else {
                    this.handleSnackbarPopup("上传失败，请重试");
                    flag = true;
                    this.setState({ progressHidden: true });
                  }
                });
              } else {
                fetch("/applications", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(
                    this.props.type === "scholarship"
                      ? {
                          applicantId: n[2],
                          applicantName: n[0],
                          year: year,
                          scholarship: {
                            status: status
                          }
                        }
                      : this.props.type === "financialAid"
                        ? {
                            applicantId: n[2],
                            applicantName: n[0],
                            year: year,
                            financialAid: {
                              status: status
                            }
                          }
                        : {
                            applicantId: n[2],
                            applicantName: n[0],
                            year: year,
                            honor: {
                              status: status
                            }
                          }
                  )
                }).then(res => {
                  if (res.status === 201) {
                    count++;
                    this.setState({ completed: (count / total) * 100 });
                    if (count === total) {
                      this.handleSnackbarPopup("上传完成");
                      this.setState({ progressHidden: true });
                    }
                  } else {
                    this.handleSnackbarPopup("上传失败，请重试");
                    flag = true;
                    this.setState({ progressHidden: true });
                  }
                });
              }
            });
        });
      };
      if (rABS) {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.flex}>
        <div>
          <input
            className={classes.input}
            id="contained-button-file"
            type="file"
            name="file"
            onChange={this.handleFileChange}
          />
          <label htmlFor="contained-button-file">
            <Button
              color="primary"
              variant="raised"
              component="span"
              className={classes.button}
            >
              上传表格
            </Button>
          </label>
        </div>
        {this.state.progressHidden ? null : (
          <CircularProgress
            className={classes.progress}
            variant={this.state.progressType}
            value={this.state.completed}
            size={25}
            thickness={5}
          />
        )}
      </div>
    );
  };
}

XLSXParser.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(XLSXParser);
