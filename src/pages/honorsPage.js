/**
 * 荣誉申请页面
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
import { isNullOrUndefined } from "util";

const fetch = auth.authedFetch;

const XlsxGeneratorForHonors = () => {
  return <XlsxGenerator type="honor" />;
};

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

class HonorsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      honors: [],
      page: 0,
      rowsPerPage: 5,
      applicantName: "",
      applicantId: "",
      class: "",
      totalHonors: "",
      comprehensiveHonor: "-",
      status: {},
      event: {
        activeStep: 2
      },
      deleteDialogOpen: false,
      applications: [],
      confirmDialogOpen: false,
      willConfirmApplicationIndex: 0
    };
  }

  componentDidMount = () => {
    fetch("/events?type=honor", {
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

    fetch("/honors", {
      method: "GET"
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(res => {
        this.setState({ honors: res });
      });

    if (auth.getRole() === "student") {
      fetch(`/applications?applicantId=${auth.getId()}&applicationType=honor`, {
        method: "GET"
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        })
        .then(res => {
          if (res.length !== 0) {
            this.setState({ status: res[0].honor.status });
          }
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
          console.log(applications);
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
    const { honors, applications, rowsPerPage, page } = this.state;
    const emptyRowsForApplications =
      rowsPerPage -
      Math.min(rowsPerPage, applications.length - page * rowsPerPage);

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

    const WithAuthXlsxGenerator = withAuth(XlsxGeneratorForHonors, [
      "reviewer",
      "admin"
    ]);

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.flex}>
            <Typography variant="display2">荣誉</Typography>
            <div className={classes.flex}>
              <WithAuthNewEventDialog />
              <WithAuthDeleteEventButton />
              <AlertDialog
                hasCancel
                title="删除荣誉事件"
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
            <Paper className={classes.paper}>
              <div className={classes.tableWrapper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>荣誉</TableCell>
                      <TableCell>申请状态</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {honors.map(n => {
                      return (
                        <TableRow key={n.id}>
                          <TableCell>{n.title}</TableCell>
                          <TableCell>
                            {applications[n.title] == null
                              ? "未申请"
                              : applications[n.title]}
                          </TableCell>
                          <TableCell>
                            <FormDialog
                              buttonDisabled={
                                auth.getRole() === "reviewer" ||
                                auth.getRole() === "teacher" ||
                                (auth.getRole() === "student" &&
                                  auth.getClass()[1] === "8")
                                  ? true
                                  : this.state.event.activeStep === 0 &&
                                    applications[n.title] == null
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
                  </TableBody>
                </Table>
              </div>
            </Paper>
            {auth.getRole() === "reviewer" ? (
              <div>
                <WithAuthXlsxGenerator />
                <Paper className={classes.paper}>
                  <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>姓名</TableCell>
                          <TableCell>班级</TableCell>
                          <TableCell>学号</TableCell>
                          <TableCell>荣誉数</TableCell>
                          <TableCell>状态</TableCell>
                          <TableCell>综合优秀奖</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Input
                              className={classes.searchBar}
                              disableUnderline={true}
                              placeholder="按姓名查找"
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
                              placeholder="按荣誉数查找"
                              onChange={this.handleInputChange("totalHonors")}
                            />
                          </TableCell>
                          <TableCell />
                          <TableCell>
                            <Input
                              className={classes.searchBar}
                              disableUnderline={true}
                              placeholder="按综合优秀奖查找"
                              onChange={this.handleInputChange(
                                "comprehensiveHonor"
                              )}
                            />
                          </TableCell>
                        </TableRow>
                        {this.state.applications
                          .filter(n => {
                            console.log(n);
                            return (
                              n.applicantName
                                .toLowerCase()
                                .includes(
                                  this.state.applicantName.toLowerCase()
                                ) &&
                              n.class.includes(this.state.class) &&
                              n.applicantId
                                .toString()
                                .includes(this.state.applicantId.toString()) &&
                              (this.state.totalHonors === ""
                                ? true
                                : Object.keys(
                                    n.honor.status
                                  ).length.toString() ===
                                  this.state.totalHonors) &&
                              (this.state.comprehensiveHonor === "是"
                                ? n.honor.status["综合优秀奖"] != null
                                : n.honor.status["综合优秀奖"] == null)
                            );
                          })
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map(n => {
                            console.log(n);
                            return (
                              <TableRow key={n.id}>
                                <TableCell>{n.applicantName}</TableCell>
                                <TableCell>{n.class}</TableCell>
                                <TableCell>{n.applicantId}</TableCell>
                                <TableCell>
                                  {Object.keys(n.honor.status).length}
                                </TableCell>
                                <TableCell>
                                  <div className={classes.chips}>
                                    {Object.keys(n.honor.status).map(
                                      (key, index) => {
                                        return (
                                          <Chip
                                            key={index}
                                            label={key}
                                            className={classes.chip}
                                            color={
                                              n.honor.status[key] === "已通过"
                                                ? "primary"
                                                : ""
                                            }
                                          />
                                        );
                                      }
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {n.honor.status["综合优秀奖"] != null
                                    ? "是"
                                    : "否"}
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
                                    .includes(
                                      this.state.applicantId.toString()
                                    ) &&
                                  (this.state.totalHonors === ""
                                    ? true
                                    : Object.keys(
                                        n.honor.status
                                      ).length.toString() ===
                                      this.state.totalHonors) &&
                                  (this.state.comprehensiveHonor === "是"
                                    ? n.honor.status["综合优秀奖"] != null
                                    : n.honor.status["综合优秀奖"] == null)
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

HonorsPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withAuth(withStyles(styles)(HonorsPage));
