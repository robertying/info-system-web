import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const styles = theme => ({
  root: {
    textAlign: "center",
    marginTop: "10%"
  },
  button: {
    margin: theme.spacing.unit
  }
});

class NotFoundPage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="display4">404</Typography>
        <Typography variant="display4">Not Found</Typography>
        <Button
          variant="raised"
          component={Link}
          to="/notices"
          className={classes.button}
        >
          返回主页
        </Button>
      </div>
    );
  }
}

NotFoundPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NotFoundPage);
