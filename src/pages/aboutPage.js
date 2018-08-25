import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import { withStyles } from "@material-ui/core/styles";
import withAuth from "../components/withAuthHOC";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    overflow: "auto",
    height: `calc(100vh - 113px)`
  },
  container: {
    maxWidth: 700,
    marginLeft: "auto",
    marginRight: "auto"
  },
  paper: theme.mixins.gutters({
    overflowX: "auto",
    paddingTop: 16,
    paddingBottom: 8,
    marginTop: theme.spacing.unit * 3
  }),
  chip: {
    textDecoration: "none",
    margin: theme.spacing.unit
  },
  title: {
    marginBottom: theme.spacing.unit
  }
});

class AboutPage extends React.Component {
  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <Typography className={classes.title} variant="display2">
            关于
          </Typography>

          <Paper className={classes.paper}>
            <Typography className={classes.title} variant="title">
              顾问
            </Typography>
            <Chip
              label="汪玉"
              className={classes.chip}
              clickable
              component="a"
              target="_blank"
              href="https://nicsefc.ee.tsinghua.edu.cn/people/yu-wang/"
            />
            <Chip
              label="沈渊"
              className={classes.chip}
              clickable
              component="a"
              target="_blank"
              href="http://oa.ee.tsinghua.edu.cn/~shenyuan/"
            />
          </Paper>
          <Paper className={classes.paper}>
            <Typography className={classes.title} variant="title">
              策划
            </Typography>
            <Chip
              label="徐晗・清华大学电子工程系本科生工作助理"
              className={classes.chip}
              clickable
            />
            <Chip
              label="谢鹏威・清华大学电子工程系2018级研究生、辅导员"
              className={classes.chip}
              clickable
            />
            <Chip
              label="王超・清华大学电子工程系2015级研究生、辅导员"
              className={classes.chip}
              clickable
            />
          </Paper>
          <Paper className={classes.paper}>
            <Typography className={classes.title} variant="title">
              历史开发者
            </Typography>
            <Chip
              label="林梓楠・清华大学电子工程系2013级本科生"
              className={classes.chip}
              clickable
              component="a"
              href="mailto:linzinan1995@126.com"
            />
            <Chip
              label="宁雪妃・清华大学电子工程系2016级研究生"
              className={classes.chip}
              clickable
              component="a"
              href="mailto:foxdoraame@gmail.com"
            />
            <Chip
              label="黄志超・清华大学电子工程系2013级本科生"
              className={classes.chip}
              clickable
              component="a"
              href="mailto:huangzc13@mails.tsinghua.edu.cn"
            />
            <Chip
              label="许璀杰・清华大学电子工程系2016级本科生"
              className={classes.chip}
              clickable
              component="a"
              href="mailto:975114697@qq.com"
            />
          </Paper>
          <Paper className={classes.paper}>
            <Typography className={classes.title} variant="title">
              当前开发者
            </Typography>
            <Chip
              label="应睿・清华大学电子工程系2016级本科生"
              className={classes.chip}
              clickable
              component="a"
              href="mailto:yingrui205@qq.com"
            />
          </Paper>
          <Paper className={classes.paper}>
            <Typography className={classes.title} variant="title">
              技术栈
            </Typography>
            <Chip
              label="react.js"
              className={classes.chip}
              clickable
              component="a"
              target="_blank"
              href="https://reactjs.org/"
            />
            <Chip
              label="material-ui"
              className={classes.chip}
              clickable
              component="a"
              target="_blank"
              href="https://material-ui.com/"
            />
            <Chip
              label="express.js"
              className={classes.chip}
              clickable
              component="a"
              target="_blank"
              href="https://expressjs.com/"
            />
          </Paper>
        </div>
      </div>
    );
  };
}

AboutPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withAuth(withStyles(styles)(AboutPage));
