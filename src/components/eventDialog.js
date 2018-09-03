import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { withStyles } from "@material-ui/core/styles";
import auth from "../helpers/auth";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import DateTimePicker from "material-ui-pickers/DateTimePicker";
import CNLocale from "date-fns/locale/zh-CN";
import DateRangeIcon from "@material-ui/icons/DateRange";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import TimeIcon from "@material-ui/icons/Timer";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import format from "date-fns/format";

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
  dateTimePicker: {
    margin: theme.spacing.unit
  },
  flexContainer: {
    display: "flex"
  }
});

class EventDialog extends React.Component {
  state = {
    open: false,
    files: [],
    title: "",
    content: "",
    selectedBeginDate: [new Date()],
    selectedEndDate: [new Date()],
    stepCount: 1,
    stepContents: [""]
  };

  handleBeginDateChange = (index, date) => {
    const selectedBeginDate = this.state.selectedBeginDate;
    selectedBeginDate[index] = date;
    this.setState({ selectedBeginDate });
  };

  handleEndDateChange = (index, date) => {
    const selectedEndDate = this.state.selectedEndDate;
    selectedEndDate[index] = date;
    this.setState({ selectedEndDate });
  };

  handleClickOpen = () => {
    this.setState({ open: true, files: [], title: "", content: "" });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    if (this.state.stepContents.some(n => n === "" || n == null)) {
      this.props.handleSnackbarPopup("请完整填写事件内容");
      return;
    }

    const body = {
      type: "mentor",
      title: "新生导师申请",
      steps: this.state.stepContents.map((n, index) => {
        return `${n}\n起 ${format(
          this.state.selectedBeginDate[index],
          "YYYY-MM-dd HH:mm",
          { locale: CNLocale }
        )}\n止 ${format(this.state.selectedEndDate[index], "YYYY-MM-dd HH:mm", {
          locale: CNLocale
        })}`;
      }),
      activeStep: 0
    };
    return fetch("/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }).then(res => {
      if (res.status === 201) {
        body.id = res.headers
          .get("Location")
          .split("/")
          .pop();
        this.props.handleDialogClose(body);
        this.handleClose();
        this.props.handleSnackbarPopup("新事件已创建");
      } else {
        this.props.handleSnackbarPopup("操作失败，请重试");
      }
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleAddButtonClick = () => {
    let stepContents = this.state.stepContents;
    stepContents.push("");
    this.setState({ stepCount: this.state.stepCount + 1, stepContents });
  };

  handleRemoveButtonClick = () => {
    if (this.state.stepCount > 1) {
      let stepContents = this.state.stepContents;
      stepContents.pop("");
      this.setState({ stepCount: this.state.stepCount - 1, stepContents });
    }
  };

  handleTextFieldChange = (index, e) => {
    const stepContents = this.state.stepContents;
    stepContents[index] = e.target.value;
    this.setState({ stepContents });
  };

  render = () => {
    const { classes } = this.props;

    return (
      <div>
        <Button
          className={classes.button}
          onClick={this.handleClickOpen}
          variant="raised"
          color="primary"
        >
          新事件
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">新事件</DialogTitle>
          <DialogContent>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={CNLocale}>
              {[...Array(this.state.stepCount)].map((e, index) => (
                <div className={classes.flexContainer} key={index}>
                  <DateTimePicker
                    className={classes.dateTimePicker}
                    dateRangeIcon={<DateRangeIcon />}
                    leftArrowIcon={<ArrowLeftIcon />}
                    rightArrowIcon={<ArrowRightIcon />}
                    timeIcon={<TimeIcon />}
                    keyboardIcon={<KeyboardIcon />}
                    ampm={false}
                    okLabel="确定"
                    cancelLabel="取消"
                    label="起始"
                    value={this.state.selectedBeginDate[index]}
                    onChange={date => this.handleBeginDateChange(index, date)}
                  />
                  <DateTimePicker
                    className={classes.dateTimePicker}
                    dateRangeIcon={<DateRangeIcon />}
                    leftArrowIcon={<ArrowLeftIcon />}
                    rightArrowIcon={<ArrowRightIcon />}
                    timeIcon={<TimeIcon />}
                    keyboardIcon={<KeyboardIcon />}
                    ampm={false}
                    okLabel="确定"
                    cancelLabel="取消"
                    label="结束"
                    value={this.state.selectedEndDate[index]}
                    onChange={date => this.handleEndDateChange(index, date)}
                  />
                  <TextField
                    className={classes.dateTimePicker}
                    label="内容"
                    value={this.state.stepContents[index]}
                    required
                    onChange={e => this.handleTextFieldChange(index, e)}
                  />
                </div>
              ))}
            </MuiPickersUtilsProvider>
            <Button
              variant="fab"
              mini
              aria-label="Add"
              className={classes.button}
              onClick={this.handleAddButtonClick}
            >
              <AddIcon />
            </Button>
            <Button
              variant="fab"
              mini
              aria-label="Remove"
              className={classes.button}
              onClick={this.handleRemoveButtonClick}
            >
              <RemoveIcon />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              取消
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              发布
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}

EventDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withMobileDialog()(withStyles(styles)(EventDialog));
