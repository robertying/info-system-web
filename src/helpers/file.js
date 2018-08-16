import FileSaver from "file-saver";
import auth from "./auth";

const fetch = auth.authedFetch;

const trimFilename = filename => {
  const end = filename.lastIndexOf(".");
  const start = filename.lastIndexOf("-");
  return filename.substring(0, start) + filename.substring(end);
};

const upload = (isPublic, file) => {
  const form = new FormData();
  form.append("file", file);
  return fetch(isPublic ? "/files/public" : "/files/private", {
    method: "POST",
    body: form
  }).then(res => Promise.resolve(res.text()));
};

const download = (isPublic, filename) => {
  console.log(filename);
  return fetch((isPublic ? "/files/public/" : "/files/private/") + filename)
    .then(res => res.blob())
    .then(blob => FileSaver.saveAs(blob, trimFilename(filename)));
};

const remove = (isPublic, filename) => {
  return fetch((isPublic ? "/files/public/" : "/files/private/") + filename, {
    method: "DELETE"
  }).then(res => Promise.resolve(res.text()));
};

export { trimFilename, upload, download, remove };
