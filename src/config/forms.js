const mentor = {
  type: "新生导师",
  dialogTitle: "新生导师申请",
  dialogContentText:
    "请在正式提出申请前，通过邮件与所选择的导师充分沟通，以避免落选",
  dialogContent: [
    {
      label: "附言",
      id: "statement",
      required: false,
      autoFocus: true,
      multiline: true,
      rows: "9"
    }
  ],
  dialogAction: [
    { id: "cancel", buttonContent: "取消" },
    { id: "submit", buttonContent: "提交" }
  ],
  hasAttachments: false,
  url: "/applications",
  postBody: {
    applicantId: 0,
    applicantName: "",
    year: 0,
    mentor: {
      status: {},
      contents: {}
    }
  },
  submittedText: "申请已提交"
};

const academicPerformance = {
  type: "奖学金",
  id: 1,
  dialogTitle: "申请学业优秀奖",
  dialogContentText: "学业优秀奖是1231243放大发她如rsfwef",
  dialogContent: [
    {
      label: "申请理由",
      id: "reason",
      required: true,
      autoFocus: true,
      multiline: true,
      rows: "9"
    },
    {
      label: "qq",
      id: "qq",
      required: true,
      autoFocus: false,
      multiline: true,
      rows: "9"
    }
  ],
  dialogAction: [
    { id: "cancel", buttonContent: "取消" },
    { id: "submit", buttonContent: "提交" }
  ],
  hasAttachments: true,
  isFilePublic: false,
  postUrl: "/applications/new",
  postBody: {
    userId: 0,
    status: "申请中",
    applicationType: "奖学金",
    applicationTypeId: 1,
    contents: null
  },
  submittedText: "申请已提交"
};

export default { academicPerformance, mentor };
