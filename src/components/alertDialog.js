/**
 * 确认取消对话框
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  hidden: {
    // 使元素不可见且不占据空间
    display: "none"
  }
});

class AlertDialog extends React.Component {
  // 窗口关闭后由 parent 执行后续操作
  // 要求传入 parent 的操作函数
  // 向 parent 返回用户选择
  handleClose = choice => {
    this.props.handleClose(choice);
  };

  render = () => {
    // fullscreen 用于移动端适配
    const { fullScreen, classes } = this.props;

    return (
      // 窗口默认隐藏
      <div className={classes.hidden}>
        <Dialog
          fullScreen={fullScreen}
          open={this.props.open}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {this.props.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{this.props.content}</DialogContentText>
          </DialogContent>
          <DialogActions>
            {// two choices or one
            this.props.hasCancel ? (
              <div>
                <Button onClick={() => this.handleClose("yes")} color="primary">
                  确定
                </Button>
                <Button
                  onClick={() => this.handleClose("no")}
                  color="primary"
                  autoFocus
                >
                  取消
                </Button>
              </div>
            ) : (
              <Button onClick={() => this.handleClose("yes")} color="primary">
                了解
              </Button>
            )}
            }
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}

AlertDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default withMobileDialog()(withStyles(styles)(AlertDialog));
