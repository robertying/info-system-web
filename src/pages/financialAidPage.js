/**
 * 助学金页面
 */

import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import withAuth from "../components/withAuthHOC";
import XLSXParser from "../components/xlsxParser";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    overflow: "auto",
    height: "100vh"
  },
  tables: {
    marginBottom: 105
  },
  button: {
    margin: theme.spacing.unit
  },
  paper: {
    marginTop: 26,
    maxWidth: 700,
    width: "85vw",
    overflowX: "auto"
  },
  table: {},

  author: {
    marginBottom: 12
  },
  title: {
    marginTop: 20,
    marginLeft: 20
  }
});

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const data = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9)
];

class FinancialAidPage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="display2">助学金</Typography>
        <div className={classes.tables}>
          <XLSXParser />
          <Paper className={classes.paper}>
            {/* <Typography variant="title" className={classes.title}>
              可申请
            </Typography> */}
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>助学金</TableCell>
                  <TableCell>审核状态</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(n => {
                  return (
                    <TableRow key={n.id}>
                      <TableCell>{n.name}</TableCell>
                      <TableCell>未申请</TableCell>
                      <TableCell>
                        <Button color="primary" disabled>
                          申请
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}

FinancialAidPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withAuth(withStyles(styles)(FinancialAidPage));
