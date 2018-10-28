/**
 * 奖学金页面
 */

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import withAuth from "../components/withAuthHOC";
import TablePaginationActionsWrapped from "../components/tablePaginationActionsWrapped";
import EventProgressSteper from "../components/progressStepper";
import EventDialog from "../components/eventDialog";
import DeleteIcon from "@material-ui/icons/Delete";
import AlertDialog from "../components/alertDialog";
import ThankLetterDialogForScholarships from "../components/thankLetterDialogForScholarships";
import XlsxParser from "../components/xlsxParser";
import { trimFilename, upload, download } from "../helpers/file";
import auth from "../helpers/auth";
import scholarshipConfig from "../config/scholarships";
import fileSaver from "file-saver";

const fetch = auth.authedFetch;

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    overflow: "auto",
    height: `calc(100vh - 113px)`
  },
  flex: {
    display: "flex",
    justifyContent: "space-between"
  },
  container: {
    maxWidth: 900,
    width: "85vw",
    marginLeft: "auto",
    marginRight: "auto"
  },
  tables: {},
  input: {
    display: "none"
  },
  button: {
    margin: theme.spacing.unit * 3,
    marginLeft: 10,
    marginBottom: 10
  },
  paper: {
    marginTop: 26,
    overflowX: "auto"
  },
  expansionPanel: {
    marginTop: 26
  },
  table: {},
  title: {
    marginTop: 20,
    marginLeft: 20
  },
  searchBar: {
    width: 75,
    fontSize: 12
  },
  text: {
    margin: theme.spacing.unit * 2
  },
  flexButton: {
    marginTop: theme.spacing.unit * 3
  },
  deleteButton: {},
  linebreak: {
    whiteSpace: "pre-wrap",
    marginTop: 20
  },
  margin: {
    marginLeft: 8
  },
  chip: {
    marginLeft: theme.spacing.unit * 2
  },
  chips: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    padding: theme.spacing.unit / 2
  },
  cell: {
    whiteSpace: "nowrap",
    maxWidth: 40
  },
  unclickable: {
    pointerEvents: "none"
  },
  simpleFlex: {
    display: "flex"
  },
  downloadButton: {
    height: 14,
    marginTop: 24,
    marginLeft: theme.spacing.unit
  }
});

class ScholarshipsPage extends React.Component {
  state = {
    applicationId: "",
    honors: [],
    page: 0,
    rowsPerPage: 5,
    applicantName: "",
    applicantId: "",
    class: "",
    totalHonors: "",
    comprehensiveHonor: "-",
    status: {},
    contents: {},
    attachments: {},
    event: {
      activeStep: 2
    },
    deleteDialogOpen: false,
    applications: [],
    confirmDialogOpen: false,
    willConfirmHonorIndex: 0,
    files: [],
    thankLetterDialogOpen: false,
    salutation: "",
    content: ""
  };

  componentDidMount = () => {
    fetch("/events?type=scholarship", {
      method: "GET"
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(res => {
        this.setState({ event: res.pop() || {} });
      });

    if (auth.getRole() === "student") {
      fetch(
        `/applications?applicantId=${auth.getId()}&applicationType=scholarship`,
        {
          method: "GET"
        }
      )
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        })
        .then(res => {
          if (res.length !== 0) {
            this.setState({ status: res[0].scholarship.status || {} });
            this.setState({ contents: res[0].scholarship.contents || {} });
            this.setState({
              attachments: res[0].scholarship.attachments || {}
            });
            this.setState({ applicationId: res[0].id });
          }
        });
    }

    if (auth.getRole() === "reviewer") {
      fetch(
        auth.getGrade()
          ? `/applications?applicantGrade=${auth.getGrade()}&applicationType=scholarship`
          : "/applications?applicationType=scholarship",
        {
          method: "GET"
        }
      )
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        })
        .then(res => {
          this.setState({ applications: res });
        });
    }
  };

  handleChipClick = (e, filename) => {
    download(false, filename);
  };

  handleNewEventDialogClose = body => {
    this.setState({ event: body });
  };

  handleUpload = title => {
    this.setState({ selectedScholarship: title });
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

    if (files.length === 0) {
      this.handleSnackbarPopup("请选择上传文件");
    } else {
      // 有附件
      let attachments = [];
      Promise.all(
        files.map(file => {
          return new Promise(res =>
            upload(false, file.data).then(filename => {
              attachments.push(filename);
              res(attachments);
            })
          );
        })
      ).then(res => {
        return fetch(`/applications/${this.state.applicationId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            scholarship: {
              attachments: {
                ...this.state.attachments,
                [this.state.selectedScholarship]: attachments
              }
            }
          })
        }).then(res => {
          if (res.ok) {
            this.handleSnackbarPopup("申请表上传成功");

            fetch(`/applications/${this.state.applicationId}`, {
              method: "GET"
            })
              .then(res => res.json())
              .then(res => {
                let attachments = this.state.attachments;
                attachments[this.state.selectedScholarship] =
                  res.scholarship.attachments[this.state.selectedScholarship];
                this.setState({ attachments });
              });
          } else {
            this.handleSnackbarPopup("上传失败，请重试");
          }
        });
      });
    }
  };

  handleEventUpdate = activeStep => {
    fetch("/events/" + this.state.event.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        activeStep: activeStep
      })
    }).then(res => {
      if (res.ok) {
        let event = this.state.event;
        event.activeStep = activeStep;
        this.setState({ event });
        this.handleSnackbarPopup("当前事件已更新");
      } else {
        this.handleSnackbarPopup("操作失败，请重试");
      }
    });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleInputChange = name => e => {
    this.setState({ [name]: e.target.value });
  };

  handleSnackbarPopup = message => {
    this.props.handleSnackbarPopup(message);
  };

  handleDialogClose = (name, e) => {
    let status = this.state.status;
    status[name] = "申请中";
    this.setState({ status });
  };

  handlePassDialogClose = (id, title, status) => {
    let applications = this.state.applications;
    for (let index = 0; index < applications.length; index++) {
      const application = applications[index];
      if (application.id === id) {
        applications[index].scholarship.contents[title].status = status;
      }
    }
    this.setState({ applications });
  };

  handleDeleteDialogClose = choice => {
    if (choice === "no") {
      this.setState({ deleteDialogOpen: false });
    } else if (choice === "yes") {
      fetch("/events/" + this.state.event.id, {
        method: "DELETE"
      }).then(res => {
        if (res.status === 204) {
          this.setState({ event: {} });
          this.setState({ deleteDialogOpen: false });
          this.props.handleSnackbarPopup("事件已删除");
        } else {
          this.props.handleSnackbarPopup("操作失败，请重试");
        }
      });
    }
  };

  handleDeleteDialogOpen = index => {
    this.setState({ deleteDialogOpen: true });
  };

  render() {
    const { classes } = this.props;
    const { status, applications, rowsPerPage, page } = this.state;
    const emptyRowsForApplications =
      rowsPerPage -
      Math.min(rowsPerPage, applications.length - page * rowsPerPage);

    const NewEventDialog = () => {
      return (
        <EventDialog
          handleDialogClose={this.handleNewEventDialogClose}
          handleSnackbarPopup={this.handleSnackbarPopup}
          type="scholarship"
        />
      );
    };

    const WithAuthNewEventDialog = withAuth(NewEventDialog, [
      "reviewer",
      "admin"
    ]);

    const DeleteEventButton = () => {
      return (
        <IconButton
          className={classes.deleteButton}
          aria-label="Delete"
          size="small"
          onClick={this.handleDeleteDialogOpen}
        >
          <DeleteIcon />
        </IconButton>
      );
    };

    const WithAuthDeleteEventButton = withAuth(DeleteEventButton, [
      "reviewer",
      "admin"
    ]);

    const XlsxParserForScholarship = () => {
      return (
        <XlsxParser
          type="scholarship"
          handleSnackbarPopup={this.handleSnackbarPopup}
        />
      );
    };

    const WithAuthXlsxParser = withAuth(XlsxParserForScholarship, [
      "reviewer",
      "admin"
    ]);

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.flex}>
            <Typography variant="h3">奖学金</Typography>
            <div className={classes.flex}>
              <WithAuthNewEventDialog />
              <WithAuthDeleteEventButton />
              <AlertDialog
                hasCancel
                title="删除奖学金事件"
                content="是否要删除此事件？"
                open={this.state.deleteDialogOpen}
                handleClose={this.handleDeleteDialogClose}
              />
            </div>
          </div>
          <div className={classes.tables}>
            <EventProgressSteper
              steps={this.state.event.steps}
              activeStep={this.state.event.activeStep}
              handleEventUpdate={this.handleEventUpdate}
            />
            {auth.getRole() !== "student" ? null : (
              <Paper className={classes.paper}>
                <div className={classes.tableWrapper}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>奖学金</TableCell>
                        <TableCell>金额</TableCell>
                        <TableCell>操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(status).map((n, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{n}</TableCell>
                            <TableCell>{status[n]}</TableCell>
                            <TableCell>
                              <ThankLetterDialogForScholarships
                                id={this.state.applicationId}
                                title={n}
                                readOnly={auth.getRole() !== "student"}
                                handleSnackbarPopup={this.handleSnackbarPopup}
                              />
                              <div className={classes.simpleFlex}>
                                <div
                                  className={
                                    scholarshipConfig.formRequired.every(
                                      x => !n.includes(x)
                                    )
                                      ? classes.unclickable
                                      : null
                                  }
                                >
                                  <input
                                    className={classes.input}
                                    id="contained-button-file"
                                    type="file"
                                    name="file"
                                    onChange={this.handleFileChange}
                                  />
                                  <label htmlFor="contained-button-file">
                                    <Button
                                      disabled={scholarshipConfig.formRequired.every(
                                        x => !n.includes(x)
                                      )}
                                      color="primary"
                                      component="span"
                                      onClick={() => this.handleUpload(n)}
                                    >
                                      申请表
                                    </Button>
                                  </label>
                                </div>
                                <div>
                                  {!scholarshipConfig.formRequired.every(
                                    x => !n.includes(x)
                                  ) &&
                                  (!this.state.attachments[n] ||
                                    this.state.attachments[n].length === 0)
                                    ? null
                                    : (this.state.attachments[n] || []).map(
                                        (file, index) => {
                                          return (
                                            <Chip
                                              key={index}
                                              label={trimFilename(file)}
                                              onClick={e =>
                                                this.handleChipClick(e, file)
                                              }
                                              className={classes.chip}
                                            />
                                          );
                                        }
                                      )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Paper>
            )}
            {auth.getRole() === "reviewer" ? (
              <div>
                <div className={classes.simpleFlex}>
                  <WithAuthXlsxParser />
                  <Button
                    className={classes.downloadButton}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      fetch(
                        `/thank-letters?grade=${auth.getGrade()}&type=scholarship`,
                        {
                          method: "GET"
                        }
                      )
                        .then(res => res.blob())
                        .then(blob =>
                          fileSaver.saveAs(
                            blob,
                            `奖学金感谢信-无${auth.getGrade()}.zip`
                          )
                        );
                    }}
                  >
                    下载感谢信
                  </Button>
                  <Button
                    className={classes.downloadButton}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      fetch(
                        `/e-forms?grade=${auth.getGrade()}&type=scholarship`,
                        {
                          method: "GET"
                        }
                      )
                        .then(res => res.blob())
                        .then(blob =>
                          fileSaver.saveAs(
                            blob,
                            `奖学金申请表-无${auth.getGrade()}.zip`
                          )
                        );
                    }}
                  >
                    下载申请表
                  </Button>
                </div>
                <div className={classes.chips}>
                  <Chip
                    className={classes.chip}
                    variant="outlined"
                    color="default"
                    label="未提交"
                  />
                  <Chip
                    className={classes.chip}
                    color="default"
                    label="已提交"
                  />
                  <Chip
                    className={classes.chip}
                    color="primary"
                    label="已通过"
                  />
                  <Chip
                    className={classes.chip}
                    color="secondary"
                    label="未通过"
                  />
                </div>
                <Paper className={classes.paper}>
                  <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.cell}>姓名</TableCell>
                          <TableCell className={classes.cell}>班级</TableCell>
                          <TableCell className={classes.cell}>学号</TableCell>
                          <TableCell className={classes.cell}>
                            奖学金总额
                          </TableCell>
                          <TableCell>获奖状态</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell className={classes.cell}>
                            <Input
                              className={classes.searchBar}
                              disableUnderline={true}
                              placeholder="按姓名查找"
                              onChange={this.handleInputChange("applicantName")}
                            />
                          </TableCell>
                          <TableCell className={classes.cell}>
                            <Input
                              className={classes.searchBar}
                              disableUnderline={true}
                              placeholder="按班级查找"
                              onChange={this.handleInputChange("class")}
                            />
                          </TableCell>
                          <TableCell className={classes.cell}>
                            <Input
                              className={classes.searchBar}
                              disableUnderline={true}
                              placeholder="按学号查找"
                              onChange={this.handleInputChange("applicantId")}
                            />
                          </TableCell>
                          <TableCell className={classes.cell} />
                          <TableCell />
                        </TableRow>
                        {this.state.applications
                          .filter(n => {
                            return (
                              n.applicantName
                                .toLowerCase()
                                .includes(
                                  this.state.applicantName.toLowerCase()
                                ) &&
                              n.class.includes(this.state.class) &&
                              n.applicantId
                                .toString()
                                .includes(this.state.applicantId.toString())
                            );
                          })
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map(n => {
                            return (
                              <TableRow key={n.id}>
                                <TableCell className={classes.cell}>
                                  {n.applicantName}
                                </TableCell>
                                <TableCell className={classes.cell}>
                                  {n.class}
                                </TableCell>
                                <TableCell className={classes.cell}>
                                  {n.applicantId}
                                </TableCell>
                                <TableCell className={classes.cell}>
                                  {Object.values(n.scholarship.status).reduce(
                                    (a, b) => a + b,
                                    0
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className={classes.chips}>
                                    {Object.keys(n.scholarship.status).map(
                                      (key, index) => {
                                        return (
                                          <ThankLetterDialogForScholarships
                                            handleSnackbarPopup={
                                              this.handleSnackbarPopup
                                            }
                                            handleDialogClose={
                                              this.handlePassDialogClose
                                            }
                                            readOnly
                                            id={n.id}
                                            title={key}
                                            key={index}
                                            label={
                                              key +
                                              "：" +
                                              n.scholarship.status[key]
                                            }
                                            variant={
                                              (n.scholarship.contents &&
                                                n.scholarship.contents[key]) ||
                                              (n.scholarship.attachments &&
                                                n.scholarship.attachments[key])
                                                ? "default"
                                                : "outlined"
                                            }
                                            color={
                                              n.scholarship.contents &&
                                              n.scholarship.contents[key]
                                                ? n.scholarship.contents[key]
                                                    .status === "已通过"
                                                  ? "primary"
                                                  : n.scholarship.contents[key]
                                                      .status === "未通过"
                                                    ? "secondary"
                                                    : "default"
                                                : "default"
                                            }
                                          />
                                        );
                                      }
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRowsForApplications > 0 && (
                          <TableRow
                            style={{ height: 48 * emptyRowsForApplications }}
                          >
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            labelRowsPerPage="每页行数"
                            colSpan={3}
                            count={
                              this.state.applications.filter(n => {
                                return (
                                  n.applicantName
                                    .toLowerCase()
                                    .includes(
                                      this.state.applicantName.toLowerCase()
                                    ) &&
                                  n.class.includes(this.state.class) &&
                                  n.applicantId
                                    .toString()
                                    .includes(this.state.applicantId.toString())
                                );
                              }).length
                            }
                            rowsPerPage={rowsPerPage}
                            page={page}
                            labelDisplayedRows={({ from, to, count }) =>
                              `${from} - ${to} 条 / 共 ${count} 条`
                            }
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActionsWrapped}
                          />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </Paper>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

ScholarshipsPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withAuth(withStyles(styles)(ScholarshipsPage));
