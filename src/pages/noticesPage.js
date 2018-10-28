/**
 * 通知页面
 */

import React from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CircularProgress from "@material-ui/core/CircularProgress";
import AttachmentIcon from "@material-ui/icons/Attachment";
import withAuth from "../components/withAuthHOC";
import NoticeDialog from "../components/noticeDialog";
import { formatDate } from "../helpers/date";
import { trimFilename, download } from "../helpers/file";
import DeleteDialog from "../components/alertDialog";
import auth from "../helpers/auth";
const fetch = auth.authedFetch;

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    overflow: "auto",
    height: `calc(100vh - 113px)`
  },
  container: {
    maxWidth: 700,
    width: "85vw",
    marginLeft: "auto",
    marginRight: "auto"
  },
  card: {
    marginTop: 18
  },
  flex: {
    display: "flex",
    justifyContent: "space-between"
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  author: {
    marginBottom: 12
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
  progress: {
    display: "block",
    margin: theme.spacing.unit * 3,
    marginLeft: "auto",
    marginRight: "auto"
  },
  deleteButton: {
    marginTop: -10,
    marginLeft: 5
  },
  linebreak: {
    whiteSpace: "pre-wrap"
  }
});

const NewNoticeDialog = withAuth(NoticeDialog, ["reviewer", "admin"]);
const DeleteNoticeDialog = withAuth(DeleteDialog, ["reviewer", "admin"]);
const DeleteButton = withAuth(IconButton, ["reviewer", "admin"]);

class NoticesPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleNewNoticeDialogClose = this.handleNewNoticeDialogClose.bind(
      this
    );
    this.loadNotices = this.loadNotices.bind(this);
  }

  state = {
    notices: [],
    hasMoreItems: true,
    deleteDialogOpen: false
  };

  handleSnackbarPopup = message => {
    this.props.handleSnackbarPopup(message);
  };

  handleChipClick = (e, filename) => {
    download(true, filename);
  };

  handleNewNoticeDialogClose = newNotice => {
    const newNotices = this.state.notices;
    newNotices.unshift(newNotice);
    this.setState({ notices: newNotices });
  };

  handleDeleteDialogClose = choice => {
    if (choice === "no") {
      this.setState({ deleteDialogOpen: false });
    } else if (choice === "yes") {
      if (this.state.notices[this.state.willDeleteNoticeIndex] === undefined) {
        this.setState({ deleteDialogOpen: false });
        return;
      } else {
        fetch(
          "/notices/" + this.state.notices[this.state.willDeleteNoticeIndex].id,
          {
            method: "DELETE"
          }
        ).then(res => {
          if (res.status === 204) {
            const newNotices = this.state.notices;
            newNotices.splice(this.state.willDeleteNoticeIndex, 1);
            this.setState({ notices: newNotices });
            this.setState({ deleteDialogOpen: false });
            this.props.handleSnackbarPopup("公告已删除");
          } else {
            this.props.handleSnackbarPopup("操作失败，请重试");
          }
        });
      }
    }
  };

  handleDeleteDialogOpen = index => {
    this.setState({ willDeleteNoticeIndex: index });
    this.setState({ deleteDialogOpen: true });
  };

  loadNotices = page => {
    fetch(`/notices?begin=${page * 5 - 4}&end=${page * 5}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        let notices = this.state.notices;
        notices = [...notices, ...res];
        this.setState({ notices: notices });

        if (res.length < 5) {
          this.setState({ hasMoreItems: false });
        }
      });
  };

  render = () => {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadNotices}
          hasMore={this.state.hasMoreItems}
          loader={
            <div className={classes.container} key={0}>
              <CircularProgress className={classes.progress} />
            </div>
          }
          useWindow={false}
        >
          <div className={classes.container}>
            <div className={classes.flex}>
              <Typography variant="h3">公告</Typography>
              <NewNoticeDialog
                handleDialogClose={this.handleNewNoticeDialogClose}
                handleSnackbarPopup={this.handleSnackbarPopup}
              />
              <DeleteNoticeDialog
                hasCancel
                title={
                  this.state.notices[this.state.willDeleteNoticeIndex] ===
                  undefined
                    ? ""
                    : this.state.notices[this.state.willDeleteNoticeIndex].title
                }
                content="是否要删除此公告？"
                open={this.state.deleteDialogOpen}
                handleClose={this.handleDeleteDialogClose}
              />
            </div>
            <div className={classes.notices}>
              {this.state.notices.map((notice, index) => {
                return (
                  <Card key={index} className={classes.card}>
                    <CardContent>
                      <div className={classes.flex}>
                        <Typography
                          className={classes.title}
                          color="textSecondary"
                        >
                          {formatDate(new Date(notice.createdAt))}
                        </Typography>
                        <div>
                          {/* <EditButton
                            className={classes.deleteButton}
                            aria-label="Edit"
                            size="small"
                            onClick={() => this.handleDeleteDialogOpen(index)}
                          >
                            <EditIcon />
                          </EditButton> */}
                          <DeleteButton
                            className={classes.deleteButton}
                            aria-label="Delete"
                            size="small"
                            onClick={() => this.handleDeleteDialogOpen(index)}
                          >
                            <DeleteIcon />
                          </DeleteButton>
                        </div>
                      </div>
                      <Typography variant="h5" component="h2">
                        {notice.title}
                      </Typography>
                      <Typography
                        className={classes.author}
                        color="textSecondary"
                      >
                        {notice.createdBy}
                      </Typography>
                      <Typography component="p" className={classes.linebreak}>
                        {notice.content}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {notice.attachments.length !== 0 ? (
                        <AttachmentIcon />
                      ) : null}
                      <div className={classes.chips}>
                        {notice.attachments.map((attachment, indexx) => {
                          return (
                            <Chip
                              key={indexx}
                              label={trimFilename(attachment)}
                              onClick={e => this.handleChipClick(e, attachment)}
                              className={classes.chip}
                            />
                          );
                        })}
                      </div>
                    </CardActions>
                  </Card>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </div>
    );
  };
}

NoticesPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NoticesPage);
