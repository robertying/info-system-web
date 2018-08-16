import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
// import { upload } from "../helpers/file";
import XLSX from "xlsx";
import auth from "../helpers/auth";
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
  }
});

class XLSXGenerator extends React.Component {
  state = {
    files: []
  };

  handleClick = e => {
    fetch("/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        let applications = [];
        const head = [
          "姓名",
          "学号",
          "荣誉数",
          "学业优秀奖",
          "科技创新优秀奖",
          "学习进步奖"
        ];
        applications.push(head);
        res.map(n => {
          let application = [];
          Object.keys(n.status.honor).map(m => {
            return (application[head.indexOf(m)] = n.status.honor[m]);
          });
          return applications.push(application);
        });
        console.log(applications);
        const worksheet = XLSX.utils.aoa_to_sheet(applications);
        let workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "奖学金");
        XLSX.writeFile(workbook, "奖学金.xlsx");
      });
  };

  handleFileChange = e => {
    this.setState({ file: e.target.files[0] });

    const rABS = true;
    const files = e.target.files,
      f = files[0];
    const reader = new FileReader();
    reader.onload = e => {
      let data = e.target.result;
      if (!rABS) data = new Uint8Array(data);
      const workbook = XLSX.read(data, { type: rABS ? "binary" : "array" });

      const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(firstWorksheet, { header: 1 });

      console.log(data);
    };
    if (rABS) reader.readAsBinaryString(f);
    else reader.readAsArrayBuffer(f);
  };

  render = () => {
    const { classes } = this.props;

    return (
      <div>
        <Button
          color="primary"
          variant="raised"
          component="span"
          className={classes.button}
          onClick={this.handleClick}
        >
          下载表格
        </Button>
      </div>
    );
  };
}

XLSXGenerator.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(XLSXGenerator);
