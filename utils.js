const fs = require('fs');

/** 写入本地日志 */
function log(logText) {
  const logPath = `./static/log.txt`;
  let oldLog = '';
  try {
    oldLog = fs.readFileSync(logPath, 'utf-8') || '';
  } catch (error) {}
  const currentLog = `${new Date().toLocaleString()}: ${logText}\n`;
  console.log(currentLog);
  oldLog += currentLog;

  try {
    fs.writeFileSync(logPath, oldLog, 'utf-8');
  } catch (error) {}
}

module.exports = {
  log,
};
