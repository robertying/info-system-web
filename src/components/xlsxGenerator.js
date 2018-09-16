/**
 * 将数据转成 Excel 文件并下载
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
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

class XLSXGenerator extends React.Component {
  state = {
    files: []
  };

  handleClick = e => {
    import("xlsx").then(XLSX => {
      fetch("/applications", {
        method: "GET"
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        })
        .then(async res => {
          let applications = res;
          await Promise.all(
            applications.map(async (n, index) => {
              let application = [];
              await fetch(`/users/students/${n.applicantId}`, {
                method: "GET"
              })
                .then(res => {
                  if (res.ok) {
                    return res.json();
                  }
                })
                .then(res => {
                  application.push(res.name);
                  application.push(res.class);
                  application.push(res.id);
                  if (this.props.type === "mentor") {
                    application.push(Object.keys(n.mentor.status)[0]);
                    application.push(Object.values(n.mentor.status)[0]);
                  }
                  if (this.props.type === "honor") {
                    application.push(
                      Object.values(n.honor.status).filter(
                        status => status === "已通过"
                      ).length
                    );
                    if (n.honor.status["学业优秀奖"]) {
                      application.push(n.honor.status["学业优秀奖"]);
                    } else {
                      application.push("");
                    }
                    if (n.honor.status["科技创新优秀奖"]) {
                      application.push(n.honor.status["科技创新优秀奖"]);
                    } else {
                      application.push("");
                    }
                    if (n.honor.status["社会工作优秀奖"]) {
                      application.push(n.honor.status["社会工作优秀奖"]);
                    } else {
                      application.push("");
                    }
                    if (n.honor.status["社会实践优秀奖"]) {
                      application.push(n.honor.status["社会实践优秀奖"]);
                    } else {
                      application.push("");
                    }
                    if (n.honor.status["志愿公益优秀奖"]) {
                      application.push(n.honor.status["志愿公益优秀奖"]);
                    } else {
                      application.push("");
                    }
                    if (n.honor.status["文艺优秀奖"]) {
                      application.push(n.honor.status["文艺优秀奖"]);
                    } else {
                      application.push("");
                    }
                    if (n.honor.status["体育优秀奖"]) {
                      application.push(n.honor.status["体育优秀奖"]);
                    } else {
                      application.push("");
                    }
                    if (n.honor.status["学习进步奖"]) {
                      application.push(n.honor.status["学习进步奖"]);
                    } else {
                      application.push("");
                    }
                    if (n.honor.status["综合优秀奖"]) {
                      application.push(n.honor.status["综合优秀奖"]);
                    } else {
                      application.push("");
                    }
                  }
                  applications[index] = application;
                });
            })
          );

          const head = () => {
            if (this.props.type === "mentor") {
              return ["申请者", "班级", "学号", "申请导师", "状态"];
            }
            if (this.props.type === "honor") {
              return [
                "姓名",
                "班级",
                "学号",
                "已获荣誉数",
                "学业优秀奖",
                "科技创新优秀奖",
                "社会工作优秀奖",
                "社会实践优秀奖",
                "志愿公益优秀奖",
                "文艺优秀奖",
                "体育优秀奖",
                "学习进步奖",
                "综合优秀奖"
              ];
            }
          };
          applications.unshift(head);

          const worksheet = XLSX.utils.aoa_to_sheet(applications);
          let workbook = XLSX.utils.book_new();
          if (this.props.type === "mentor") {
            XLSX.utils.book_append_sheet(workbook, worksheet, "新生导师申请");
            XLSX.writeFile(workbook, "新生导师申请.xlsx");
          }
          if (this.props.type === "honor") {
            XLSX.utils.book_append_sheet(workbook, worksheet, "荣誉申请");
            XLSX.writeFile(workbook, "荣誉申请.xlsx");
          }
        });
    });
  };

  render = () => {
    const { classes } = this.props;

    return (
      <div>
        <Button
          color="primary"
          variant="raised"
          component="span"
          className={classes.button}
          onClick={this.handleClick}
        >
          下载表格
        </Button>
      </div>
    );
  };
}

XLSXGenerator.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(XLSXGenerator);
