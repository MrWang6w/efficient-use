const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { log } = require('./utils');

const defaultFormat = (data) => {
  const $ = cheerio.load(data);
  const mainContent = $('.highlighter-rouge .highlight code')
    .text()
    .split('\n');
  mainContent.splice(1, 4);
  return mainContent;
};

const originSiteFormat = (data) => {
  const $ = cheerio.load(data);
  const mainContent = $('.snippet-clipboard-content > .notranslate code')
    .text()
    .split('\n');
  return mainContent;
}

const linksConf = [
  {
    link: 'https://github.com/Pawdroid/Free-servers/blob/main/README.md',
    format: originSiteFormat,
  },
  {
    link: 'https://github.com/githubvpn007/v2rayNvpn/blob/main/README.md',
    format: originSiteFormat,
  },
  {
    link: 'https://mksshare.github.io/',
    format: defaultFormat,
  },
  {
    link: 'https://abshare.github.io/',
    format: defaultFormat,
  },
];

async function getAbshare({link,format}) {
  const { data } = await axios({
    url: link,
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-ch-ua':
        '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      Referer: link,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    },
  });

  return format(data);
}

async function tasks() {
  let content = [];
  for (let i = 0; i < linksConf.length; i++) {
    content = [...content, ...(await getAbshare(linksConf[i]))];
  }
  content = [...new Set(content.map((x) => x.trim()).filter(Boolean))];
  if (content?.length) {
    content = content.join('\n');
    const ssr = Buffer.from(content).toString('base64');
    fs.writeFileSync('./static/abShare.txt', ssr, 'utf-8');
    fs.writeFileSync('./static/content.txt', content, 'utf-8');
    log('获取abShare节点，保存成功');
  }
}

tasks();
