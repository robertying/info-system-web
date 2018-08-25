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
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import withAuth from "../components/withAuthHOC";
import TablePaginationActionsWrapped from "../components/tablePaginationActionsWrapped";
import { Input, Button } from "../../node_modules/@material-ui/core";
import auth from "../helpers/auth";
import FormDialog from "../components/formDialog";
import EventProgressSteper from "../components/progressStepper";
import EventDialog from "../components/eventDialog";
import DeleteIcon from "@material-ui/icons/Delete";
import AlertDialog from "../components/alertDialog";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import XlsxGenerator from "../components/xlsxGenerator";
import year from "../config/year";

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
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto"
  },
  tables: {},
  button: {
    margin: theme.spacing.unit
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
    width: 100
  },
  text: {
    margin: theme.spacing.unit * 2
  },
  flexButton: {
    marginTop: theme.spacing.unit * 3
  },
  deleteButton: {},
  linebreak: {
    whiteSpace: "pre-wrap"
  }
});

class MentorsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mentors: [],
      page: 0,
      rowsPerPage: 5,
      applicantName: "",
      applicantId: "",
      class: "",
      teacherName: "",
      applicationStatus: "",
      status: {},
      event: {
        activeStep: 2
      },
      deleteDialogOpen: false,
      applications: [],
      applicationsForTeacher: [],
      confirmDialogOpen: false,
      willConfirmApplicationIndex: 0,
      terminateButtonDisabled: false,
      terminateDialogOpen: false
    };
  }

  componentDidMount = () => {
    fetch("/events?type=mentor", {
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
      fetch(`/applications?applicantId=${auth.getId()}`, {
        method: "GET"
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        })
        .then(res => {
          if (res.length === 0) {
            this.setState({ status: { "": "未申请" } });
          } else {
            const status = res[0].mentor.status;
            this.setState({ status });
          }
          fetch(
            this.state.event.activeStep === 0
              ? "/users/teachers?notReceiveFull=" + year
              : "/users/teachers",
            {
              method: "GET"
            }
          )
            .then(res => {
              if (res.ok) {
                return res.json();
              }
            })
            .then(res =>
              this.setState({ mentors: res, mentorsCount: res.length })
            );
        });
    }

    if (auth.getRole() === "teacher") {
      fetch(`/applications?teacherName=${auth.getName()}`, { method: "GET" })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        })
        .then(async res => {
          let applications = res;
          await Promise.all(
            applications.map(async (application, index) => {
              await fetch(`/users/students/${application.applicantId}`, {
                method: "GET"
              })
                .then(res => {
                  if (res.ok) {
                    return res.json();
                  }
                })
                .then(res => {
                  applications[index].email = res.email;
                  applications[index].phone = res.phone;
                });
            })
          );
          this.setState({ applicationsForTeacher: applications });
        });
    }

    if (auth.getRole() === "reviewer") {
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
            applications.map(async (application, index) => {
              await fetch(`/users/students/${application.applicantId}`, {
                method: "GET"
              })
                .then(res => {
                  if (res.ok) {
                    return res.json();
                  }
                })
                .then(res => {
                  applications[index].class = res.class;
                });
            })
          );
          this.setState({ applications });
        });
    }
  };

  handleNewEventDialogClose = body => {
    this.setState({ event: body });
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
    delete status[""];
    status[name] = "申请中";
    this.setState({ status });
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

  handleTerminateDialogClose = choice => {
    if (choice === "no") {
      this.setState({ terminateDialogOpen: false });
    } else if (choice === "yes") {
      fetch("/users/teachers/" + auth.getId(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          receiveFull: year
        })
      }).then(res => {
        if (res.ok) {
          this.setState({ terminateDialogOpen: false });
          this.setState({ terminateButtonDisabled: true });
          this.props.handleSnackbarPopup("已终止接收新学生");
        } else {
          this.props.handleSnackbarPopup("操作失败，请重试");
        }
      });
    }
  };

  handleTerminateDialogOpen = index => {
    this.setState({ terminateDialogOpen: true });
  };

  handleTerminateButtonClick = e => {
    this.setState({ terminateDialogOpen: true });
  };

  handleConfirmDialogOpen = index => {
    this.setState({ willConfirmApplicationIndex: index });
    this.setState({ confirmDialogOpen: true });
  };

  handleConfirmDialogClose = choice => {
    if (choice === "no") {
      this.setState({ confirmDialogOpen: false });
    } else if (choice === "yes") {
      const id = this.state.applicationsForTeacher[
        this.state.willConfirmApplicationIndex
      ].id;
      let body = this.state.applicationsForTeacher[
        this.state.willConfirmApplicationIndex
      ];
      delete body.id;
      body.mentor.status[Object.keys(body.mentor.status)[0]] = "已通过";
      fetch("/applications/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }).then(res => {
        if (res.status === 204) {
          body.id = id;
          let applicationsForTeacher = this.state.applicationsForTeacher;
          applicationsForTeacher[this.state.willConfirmApplicationIndex] = body;
          this.setState({ applicationsForTeacher });
          this.setState({ confirmDialogOpen: false });
          this.props.handleSnackbarPopup("申请状态已更新");
        } else {
          this.props.handleSnackbarPopup("操作失败，请重试");
        }
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { mentors, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, mentors.length - page * rowsPerPage);

    const NewEventDialog = () => {
      return (
        <EventDialog
          handleDialogClose={this.handleNewEventDialogClose}
          handleSnackbarPopup={this.handleSnackbarPopup}
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

    const TerminateButton = () => {
      return (
        <Button
          className={classes.flexButton}
          variant="raised"
          color="primary"
          onClick={this.handleTerminateButtonClick}
          disabled={this.state.terminateButtonDisabled}
        >
          终止接收
        </Button>
      );
    };

    const WithAuthTerminateButton = withAuth(TerminateButton, ["teacher"]);

    const WithAuthXlsxGenerator = withAuth(XlsxGenerator, [
      "reviewer",
      "admin"
    ]);

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.flex}>
            <Typography variant="display2">新生导师</Typography>
            <div className={classes.flex}>
              <WithAuthNewEventDialog />
              <WithAuthDeleteEventButton />
              <AlertDialog
                hasCancel
                title="删除新生导师事件"
                content="是否要删除此事件？"
                open={this.state.deleteDialogOpen}
                handleClose={this.handleDeleteDialogClose}
              />
              <AlertDialog
                hasCancel
                title={
                  this.state.applicationsForTeacher[
                    this.state.willConfirmApplicationIndex
                  ] === undefined
                    ? ""
                    : this.state.applicationsForTeacher[
                        this.state.willConfirmApplicationIndex
                      ].applicantName
                }
                content="是否要成为该学生的新生导师？"
                open={this.state.confirmDialogOpen}
                handleClose={this.handleConfirmDialogClose}
              />
              <AlertDialog
                hasCancel
                title="终止接收"
                content="是否要终止接收新学生？"
                open={this.state.terminateDialogOpen}
                handleClose={this.handleTerminateDialogClose}
              />
            </div>
          </div>
          <div className={classes.tables}>
            <EventProgressSteper
              steps={this.state.event.steps}
              activeStep={this.state.event.activeStep}
              handleEventUpdate={this.handleEventUpdate}
            />
            <WithAuthTerminateButton />
            <Paper className={classes.expansionPanel}>
              {auth.getRole() !== "teacher" ? null : this.state
                .applicationsForTeacher.length === 0 ? (
                <div className={classes.text}>
                  <Typography>暂无申请</Typography>
                </div>
              ) : (
                this.state.applicationsForTeacher.map((n, index) => {
                  return (
                    <ExpansionPanel key={index}>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>
                          {n.applicantName +
                            " " +
                            n.applicantId +
                            " " +
                            n.mentor.status[Object.keys(n.mentor.status)[0]]}
                        </Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <div>
                          <Typography className={classes.linebreak}>
                            {`附言：${n.mentor.contents.statement}\n邮箱：${
                              n.email
                            }\n手机：${n.phone}`}
                          </Typography>
                          <Button
                            className={classes.flexButton}
                            variant="raised"
                            color="primary"
                            onClick={() => this.handleConfirmDialogOpen(index)}
                            disabled={
                              n.mentor.status[
                                Object.keys(n.mentor.status)[0]
                              ] === "已通过"
                            }
                          >
                            接受申请
                          </Button>
                        </div>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  );
                })
              )}
            </Paper>
            {auth.getRole() !== "student" ||
            Object.values(this.state.status)[0] === "未申请" ? null : (
              <Paper className={classes.paper}>
                <div className={classes.tableWrapper}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>姓名</TableCell>
                        <TableCell>状态</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          {Object.keys(this.state.status)[0]}
                        </TableCell>
                        <TableCell>
                          {Object.values(this.state.status)[0]}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </Paper>
            )}
            {auth.getRole() === "teacher" ||
            auth.getRole() === "reviewer" ? null : (
              <Paper className={classes.paper}>
                <div className={classes.tableWrapper}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>姓名</TableCell>
                        <TableCell>院系</TableCell>
                        <TableCell>邮箱</TableCell>
                        <TableCell>申请数</TableCell>
                        <TableCell>操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Input
                            className={classes.searchBar}
                            disableUnderline={true}
                            placeholder="按姓名查找"
                            onChange={this.handleInputChange("teacherName")}
                          />
                        </TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>
                      {this.state.mentors
                        .filter(n => {
                          return n.name
                            .toLowerCase()
                            .includes(this.state.teacherName.toLowerCase());
                        })
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map(n => {
                          return (
                            <TableRow key={n.id}>
                              <TableCell>{n.name}</TableCell>
                              <TableCell>{n.department}</TableCell>
                              <TableCell>{n.email}</TableCell>
                              <TableCell>{n.totalApplications}</TableCell>
                              <TableCell>
                                <FormDialog
                                  buttonDisabled={
                                    auth.getRole() === "reviewer"
                                      ? true
                                      : this.state.event.activeStep === 0 &&
                                        Object.values(this.state.status)[0] ===
                                          "未申请"
                                        ? false
                                        : true
                                  }
                                  buttonContent="申请"
                                  formType="mentor"
                                  userfulData={n}
                                  handleDialogClose={e =>
                                    this.handleDialogClose(n.name, e)
                                  }
                                  handleSnackbarPopup={this.handleSnackbarPopup}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 48 * emptyRows }}>
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
                            this.state.mentors.filter(n => {
                              return n.name
                                .toLowerCase()
                                .includes(this.state.teacherName.toLowerCase());
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
            )}
            {auth.getRole() === "reviewer" ? (
              <div>
                <WithAuthXlsxGenerator />
                <Paper className={classes.paper}>
                  <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>申请者</TableCell>
                          <TableCell>班级</TableCell>
                          <TableCell>学号</TableCell>
                          <TableCell>申请导师</TableCell>
                          <TableCell>状态</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Input
                              className={classes.searchBar}
                              disableUnderline={true}
                              placeholder="按申请者查找"
                              onChange={this.handleInputChange("applicantName")}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              className={classes.searchBar}
                              disableUnderline={true}
                              placeholder="按班级查找"
                              onChange={this.handleInputChange("class")}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              className={classes.searchBar}
                              disableUnderline={true}
                              placeholder="按学号查找"
                              onChange={this.handleInputChange("applicantId")}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              className={classes.searchBar}
                              disableUnderline={true}
                              placeholder="按导师查找"
                              onChange={this.handleInputChange("teacherName")}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              className={classes.searchBar}
                              disableUnderline={true}
                              placeholder="按状态查找"
                              onChange={this.handleInputChange(
                                "applicationStatus"
                              )}
                            />
                          </TableCell>
                        </TableRow>
                        {this.state.applications
                          .filter(n => {
                            return (
                              n.applicantName
                                .toLowerCase()
                                .includes(
                                  this.state.applicantName.toLowerCase()
                                ) &&
                              n.class
                                .toString()
                                .includes(this.state.class.toString()) &&
                              n.applicantId
                                .toString()
                                .includes(this.state.applicantId.toString()) &&
                              Object.keys(n.mentor.status)[0]
                                .toLowerCase()
                                .includes(
                                  this.state.teacherName.toLowerCase()
                                ) &&
                              Object.values(n.mentor.status)[0]
                                .toLowerCase()
                                .includes(
                                  this.state.applicationStatus.toLowerCase()
                                )
                            );
                          })
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map(n => {
                            return (
                              <TableRow key={n.id}>
                                <TableCell>{n.applicantName}</TableCell>
                                <TableCell>{n.class}</TableCell>
                                <TableCell>{n.applicantId}</TableCell>
                                <TableCell>
                                  {Object.keys(n.mentor.status)[0]}
                                </TableCell>
                                <TableCell>
                                  {Object.values(n.mentor.status)[0]}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 48 * emptyRows }}>
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
                                  n.class
                                    .toString()
                                    .includes(this.state.class.toString()) &&
                                  n.applicantId
                                    .toString()
                                    .includes(
                                      this.state.applicantId.toString()
                                    ) &&
                                  Object.keys(n.mentor.status)[0]
                                    .toLowerCase()
                                    .includes(
                                      this.state.teacherName.toLowerCase()
                                    ) &&
                                  Object.values(n.mentor.status)[0]
                                    .toLowerCase()
                                    .includes(
                                      this.state.applicationStatus.toLowerCase()
                                    )
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

MentorsPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withAuth(withStyles(styles)(MentorsPage));
