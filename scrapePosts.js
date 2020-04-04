const chalk = require('chalk');
const puppeteer = require('puppeteer');

const authInfo = require('./auth-info');

const log = console.log;

const scrapePosts = async () => {
  log(chalk.blue('Starting scraper...'))
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  log(chalk.blue('Opening the website...'))
  await page.goto('https://meeting.ssafy.com/login');

  await page.waitForSelector('button', {
    visible: true,
  });

  // await page.screenshot({ path: '1.png' });
  log(chalk.blue('Attempting Login...'))
  await page.type('[name=loginId]', authInfo.email);
  await page.type('[name=password]', authInfo.password);

  // await page.screenshot({ path: '2.png' });

  await page.click('[type=submit]');

  log(chalk.blue('Logging in...'))
  await page.waitFor(3000);

  log(chalk.blue('Opening [3.이벤트] Tab...'))
  await page.goto('https://meeting.ssafy.com/s03p11a01/channels/30');

  await page.waitForSelector('img.Avatar-md', {
    visible: true,
  });

  // await page.screenshot({ path: '3.png' });
  log(chalk.blue('Parsing the web page...'))
  const data = await page.evaluate(async () => {
    const posts = document.querySelectorAll('.post__content');
    const posts_detail = Array.from(posts).map(p => {
      const name = p.querySelector('button.user-popover').innerText;
      const time = p.querySelector('.post__time').innerText;
      const msg = p.querySelector('.post-message__text').innerText;

      return {
        name,
        time,
        msg,
      };
    });
    console.log(posts_detail)
    return posts_detail;
  });
  log(chalk.blue('Closing scraper...'))
  log();
  await browser.close();
  return data;
}

module.exports = scrapePosts;