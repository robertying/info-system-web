/**
 * 用于显示活动进度的进度栏
 */

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import withAuth from "./withAuthHOC";

const styles = theme => ({
  root: {
    width: "100%"
  },
  paper: theme.mixins.gutters({
    maxWidth: 700,
    overflowX: "auto",
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  }),
  linebreak: {
    // 使得 \n 起到换行作用
    whiteSpace: "pre-line"
  },
  buttons: {
    display: "flex",
    justifyContent: "center"
  },
  button: {
    margin: theme.spacing.unit
  }
});

class ProgressStepper extends React.Component {
  state = {
    activeStep: this.props.activeStep || 0,
    steps: this.props.steps || ["--", "--", "--"]
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      activeStep: nextProps.activeStep || 0,
      steps: nextProps.steps || ["--", "--", "--"]
    };
  }

  handleClickBackward = e => {
    const now = this.state.activeStep;
    if (now !== 0) {
      this.setState({ activeStep: now - 1 });
      this.props.handleEventUpdate(now - 1);
    }
  };

  handleClickForward = e => {
    const now = this.state.activeStep;
    if (now !== this.state.steps.length) {
      this.setState({ activeStep: now + 1 });
      this.props.handleEventUpdate(now + 1);
    }
  };

  render() {
    const { classes } = this.props;

    const Buttons = () => {
      return (
        <div className={classes.buttons}>
          <Button
            className={classes.button}
            variant="raised"
            color="primary"
            onClick={this.handleClickBackward}
          >
            上一阶段
          </Button>
          <Button
            className={classes.button}
            variant="raised"
            color="primary"
            onClick={this.handleClickForward}
          >
            下一阶段
          </Button>
        </div>
      );
    };

    const WithAuthButtons = withAuth(Buttons, ["reviewer"]);

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Stepper activeStep={this.state.activeStep} alternativeLabel>
            {this.state.steps.map(label => {
              return (
                <Step key={label}>
                  <StepLabel className={classes.linebreak}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <WithAuthButtons />
        </Paper>
      </div>
    );
  }
}

ProgressStepper.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProgressStepper);
