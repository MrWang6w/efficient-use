const fs = require('fs');

/** 写入本地日志 */
function log(logText) {
  const logPath = `./static/log.txt`;
  let oldLog = '';
  try {
    oldLog = fs.readFileSync(logPath, 'utf-8') || '';
  } catch (error) {}
  const options = {
    timeZone: 'Asia/Shanghai',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const datetimeString = new Date().toLocaleString('zh-CN', options);
  const currentLog = `${datetimeString}: ${logText}\n`;
  console.log(currentLog);
  oldLog += currentLog;

  try {
    fs.writeFileSync(logPath, oldLog, 'utf-8');
  } catch (error) {}
}

module.exports = {
  log,
};
