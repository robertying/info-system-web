import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
// import { upload } from "../helpers/file";
import XLSX from "xlsx";

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

class XLSXParser extends React.Component {
  state = {
    files: []
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
        <input
          className={classes.input}
          id="contained-button-file"
          type="file"
          name="file"
          onChange={this.handleFileChange}
        />
        <label htmlFor="contained-button-file">
          <Button
            color="primary"
            variant="raised"
            component="span"
            className={classes.button}
          >
            上传表格
          </Button>
        </label>
      </div>
    );
  };
}

XLSXParser.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(XLSXParser);
