const fs = require('fs');
const net = require('net');

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
  oldLog = currentLog + oldLog;

  try {
    fs.writeFileSync(logPath, oldLog, 'utf-8');
  } catch (error) {}
}

/** 根据配置文本 输出配置信息 */
function parseNode(node) {
  let config = {};

  if (node.startsWith("vmess://")) {
    const vmessURL = Buffer.from(node.slice(8), "base64").toString("utf-8");
    const vmessData = JSON.parse(vmessURL);

    config.type = "vmess";
    config.address = vmessData.add;
    config.port = vmessData.port;
    config.userId = vmessData.id;
    config.alterId = vmessData.aid;
    config.security = vmessData.tls === "tls" ? "tls" : "none";
    config.network = vmessData.net;
    config.path = vmessData.path;
    config.host = vmessData.host;
    config.ps = vmessData.ps;
  } else if (node.startsWith("trojan://")) {
    const trojanURL = new URL(node);
    const password = trojanURL.username;
    const server = trojanURL.hostname;
    const port = parseInt(trojanURL.port);
    const sni = trojanURL.searchParams.get("sni");

    config.type = "trojan";
    config.password = password;
    config.address = server;
    config.port = port;
    config.sni = sni;
  } else {
    throw new Error("Invalid node format");
  }

  return config;
}


function checkNodeAlive(config) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(config.port, config.server);

    socket.setTimeout(5000); // 设置超时时间为 5 秒

    socket.on('connect', () => {
      socket.end();
      resolve(true); // 如果成功连接，则认为节点存活

    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('Connection timeout')); // 连接超时时抛出错误
    });

    socket.on('error', (err) => {
      reject(err); // 连接发生错误时抛出错误
    });
  });
}

module.exports = {
  log,
  parseNode,
  checkNodeAlive
};
