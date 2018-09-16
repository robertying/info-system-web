/**
 * 格式化日期小工具
 * @param {Date} date
 */
const formatDate = date => {
  const d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  return year + " 年 " + month + " 月 " + day + " 日";
};

export { formatDate };
