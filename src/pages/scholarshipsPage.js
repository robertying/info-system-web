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
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import withAuth from "../components/withAuthHOC";
import TablePaginationActionsWrapped from "../components/tablePaginationActionsWrapped";
import EventProgressSteper from "../components/progressStepper";
import EventDialog from "../components/eventDialog";
import DeleteIcon from "@material-ui/icons/Delete";
import AlertDialog from "../components/alertDialog";
import XlsxParser from "../components/xlsxParser";
import { download } from "../helpers/file";
import auth from "../helpers/auth";

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
    margin: theme.spacing.unit / 2,
    marginLeft: 0
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
    willConfirmHonorIndex: 0
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

  handleMaterialDialogClose = material => {
    this.setState({ contents: material.honor.contents });
    this.setState({ attachments: material.honor.attachments });
  };

  handleReadOnlyMaterialDialogClose = () => {};

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
    this.setState({ willConfirmHonorIndex: index });
    this.setState({ confirmDialogOpen: true });
  };

  handleConfirmDialogClose = choice => {
    if (choice === "no") {
      this.setState({ confirmDialogOpen: false });
    } else if (choice === "yes") {
      const title = this.state.honors[this.state.willConfirmHonorIndex].title;
      fetch("/applications/" + this.state.applicationId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          honor: {
            status: {
              [title]: "申请中"
            }
          }
        })
      }).then(res => {
        if (res.status === 204) {
          let status = this.state.status;
          status[this.state.honors[this.state.willConfirmHonorIndex].title] =
            "申请中";
          this.setState({ status });
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
            <Typography variant="display2">奖学金</Typography>
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
                            <TableCell>- -</TableCell>
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
                <WithAuthXlsxParser />
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
                          <TableCell className={classes.cell}>
                            其他材料
                          </TableCell>
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
                          <TableCell className={classes.cell} />
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
                                          <Chip
                                            key={index}
                                            label={
                                              key +
                                              "：" +
                                              n.scholarship.status[key]
                                            }
                                            className={classes.chip}
                                            color="primary"
                                          />
                                        );
                                      }
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className={classes.cell}>
                                  - -
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
