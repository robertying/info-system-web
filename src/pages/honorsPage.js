import React from "react";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import withAuth from "../components/withAuthHOC";
import ProgressStepper from "../components/progressStepper";
import auth from "../helpers/auth";
import FormDialog from "../components/formDialog";
const fetch = auth.authedFetch;

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    overflow: "auto",
    height: `calc(100vh - 113px)`
  },
  container: {
    maxWidth: 900,
    marginLeft: "auto",
    marginRight: "auto"
  },
  flex: {
    display: "flex",
    justifyContent: "space-between"
  },
  tables: {},
  button: {
    margin: theme.spacing.unit
  },
  paper: {
    marginTop: 26,
    maxWidth: 900,
    overflowX: "auto"
  },
  chips: {
    display: "flex"
    // flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing.unit / 2
  },
  author: {
    marginBottom: 12
  },
  title: {
    marginTop: 20,
    marginLeft: 20
  }
});

class HonorsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      honors: [],
      honorStatus: {},
      event: {},
      applications: []
    };
  }

  handleSnackbarPopup = message => {
    this.props.handleSnackbarPopup(message);
  };

  handleDialogClose = res => {
    // let newhonorStatus = this.state.honorStatus;
    // newhonorStatus[res.applicationTypeId] = res;
    // this.setState({ applications: newApplications });
  };

  handleEventUpdate = activeStep => {
    fetch("/events/" + this.state.event.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        steps: this.state.event.steps,
        activeStep: activeStep
      })
    })
      .then(res => res.text())
      .then(res => {
        let event = this.state.event;
        event.activeStep = activeStep;
        this.setState({ event });
        this.handleSnackbarPopup("当前事件已更新");
      });
  };

  componentDidMount = () => {
    fetch("/events/active", { method: "GET" })
      .then(res => res.json())
      .then(res => {
        this.setState({ event: res });
      });

    fetch("/applications", { method: "POST" })
      .then(res => res.json())
      .then(res => {
        this.setState({ applications: res });
      });

    fetch("/honors", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ honors: res });
        fetch("/applications/" + auth.getId(), {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
          .then(res => res.json())
          .then(res => {
            const honorStatus = res.status.honor;
            this.setState({ honorStatus });
          });
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <Typography variant="display2">荣誉</Typography>
          <ProgressStepper
            activeStep={this.state.event.activeStep}
            steps={this.state.event.steps}
            handleEventUpdate={this.handleEventUpdate}
          />
          <div className={classes.tables}>
            <Paper className={classes.paper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>荣誉</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.honors.map(n => {
                    return (
                      <TableRow key={n.id}>
                        <TableCell>{n.title}</TableCell>
                        <TableCell>
                          {this.state.honorStatus[n.title] === undefined
                            ? "未申请"
                            : this.state.honorStatus[n.title]}
                        </TableCell>
                        <TableCell>
                          <FormDialog
                            formType={n.englishTitle}
                            buttonDisabled={
                              this.state.honorStatus[n.title] !== undefined
                            }
                            buttonContent="申请"
                            handleDialogClose={this.handleDialogClose}
                            handleSnackbarPopup={this.handleSnackbarPopup}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
            <Paper className={classes.paper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>姓名</TableCell>
                    <TableCell>学号</TableCell>
                    <TableCell>荣誉数</TableCell>
                    <TableCell>荣誉</TableCell>
                    <TableCell>综合优秀奖</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.applications.map((n, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{n.userName}</TableCell>
                        <TableCell>{n.userId}</TableCell>
                        <TableCell>
                          {Object.keys(n.status.honor).length}
                        </TableCell>
                        <TableCell>
                          <div className={classes.chips}>
                            {Object.keys(n.status.honor).map((key, index) => {
                              return (
                                <Chip
                                  key={index}
                                  label={key}
                                  className={classes.chip}
                                />
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          {n.status.honor["综合优秀奖"] === undefined
                            ? "否"
                            : "是"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
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
